import express from "express";
import mongoose from "mongoose";    
import jwt from "jsonwebtoken"
import { ContentModel, UserModel } from "./db.js";

import {config} from "./config.js"
import { userMiddleware } from "./middleware.js";


const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) =>{
    const username = req.body.username
    const password = req.body.password

    try{
        await UserModel.create({
            username: username,
            password: password
        })

        res.json({
            message: "User Signed up"
        })
    }catch(e){
        res.status(411).json({
            message: "User already Exists"
        })
    }
})

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

    await ContentModel.create({
        link,
        type,
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


app.delete("/api/v1/content",userMiddleware,async (req, res) =>{
    const contentId = req.body.contetnId
    //@ts-ignore
    const userId = req.userId
    try{
        await ContentModel.deleteMany({
            contentId,
            userId
        })
        res.json({
            message: "Content deleted"
        })
    }catch(e){
        res.json({
            message: "Unable to delete"
        })
    }
})


app.post("/api/v1/brain/share", (req, res) =>{
    
})

app.post("/api/v1/brain/:shareLink", (req, res) =>{
    
})

app.listen(3000);