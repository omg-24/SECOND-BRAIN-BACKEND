
import mongoose, {model , Schema} from "mongoose";
import { config } from "./config.js";

mongoose.connect(config.MONGODB_URL as string)

const UserSchema = new Schema({
    username: {type: String , unique: true},
    password: {type:String}
})

export const UserModel = model("user", UserSchema);

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


