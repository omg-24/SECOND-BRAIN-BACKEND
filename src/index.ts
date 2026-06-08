import express from "express";
import mongoose from "mongoose";    
import jwt from "jsonwebtoken"
import { ContentModel, UserModel,LinkModel } from "./db.js";
import crypto from "crypto";
import {config} from "./config.js"
import { userMiddleware } from "./middleware.js";
import cors from "cors";
import { random } from "./utils.js";



const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await UserModel.create({
            username,
            password
        });

        res.json({
            message: "User Signed up"
        });
    } catch (e) {
        res.status(409).json({
            message: "User already exists"
        });
    }
});

app.post("/api/v1/signin", async (req, res) =>{
    const username = req.body.username
    const password = req.body.password

    const existingUser = await UserModel.findOne({
        username: username,
        password: password
    })

    if(existingUser){
        const token = jwt.sign({
            id:existingUser._id
        }, config.JWT_SECRET as string)

        res.json({
            token
        })
    }else{
        res.status(403).json({
            message: "Invalid credentials"
        })
    }
    
})

app.post("/api/v1/content",userMiddleware, async (req, res) =>{
    const link = req.body.link
    const type = req.body.type;
    const title = req.body.title
    await ContentModel.create({
        link,
        type,
        title, 
        //@ts-ignore
        userId: req.userId,
        tags: []
    })
    res.json({
        message: "Content added"
    }) 

})

app.get("/api/v1/content",userMiddleware,async (req, res) =>{
    //@ts-ignore
    const userId = req.userId
    const content = await ContentModel.find({
        userId
    }).populate("userId", "username")

    res.json({
        content
    })
})

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;

    //@ts-ignore
    const userId = req.userId;

    try {
        const deletedContent = await ContentModel.deleteOne({
            _id: contentId,
            userId
        });

        if (deletedContent.deletedCount === 0) {
            return res.status(404).json({
                message: "Content not found"
            });
        }

        res.json({
            message: "Content deleted"
        });
    } catch (e) {
        res.status(500).json({
            message: "Unable to delete content"
        });
    }
});


app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    try {
        const  share = req.body.share;

        if(share){
            const hash = random(10)
            await LinkModel.create({
                //@ts-ignore
                userId: req.userId,
                hash: hash
            })
            res.json({
                message: "share/"+hash
            })

        }else{
            await LinkModel.deleteMany({
                //@ts-ignore
                userId: req.userId
            })
            res.json({
                message: "Removed sharable link"
            })
        }

        
        
    } catch (e) {
        res.status(500).json({
            message: "Unable to generate share link"
        });
    }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    try {
        const hash = req.params.shareLink;

        const link = await LinkModel.findOne({
            hash
        });

        if (!link) {
            return res.status(411).json({
                message: "Share link not found"
            });
        }

        const content = await ContentModel.find({
            userId: link.userId
        }).populate("userId", "username");

        const creator = await UserModel.findOne({
            userId: link.userId
        })

        res.json({
            username: creator?.username,
            content: content
        });
    } catch (e) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default app;