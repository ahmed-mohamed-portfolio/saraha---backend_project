import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 1000
    },
    image: {
        type: String,
    },
    receverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})



export const messageModel = mongoose.model('Message', MessageSchema)
