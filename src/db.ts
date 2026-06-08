
import mongoose, {model , Schema} from "mongoose";
import { config } from "./config.js";

mongoose.connect(config.MONGODB_URL as string)

const UserSchema = new Schema({
    username: {type: String , unique: true},
    password: {type:String}
})

export const UserModel = model("user", UserSchema);


const tagSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }
});

export const TagModel = mongoose.model("Tag", tagSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    type: String,
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tag"
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
})

export const ContentModel = model("content", ContentSchema)


const LinkSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    }
});

export const LinkModel = mongoose.model("Link", LinkSchema);


