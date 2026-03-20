import mongoose from "mongoose";


const TokenSchema = new mongoose.Schema({
    token: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId
        , ref: "User",
        required: true
    },
    expiresAt: {
        type: Date,
        index: { expires: 0 }
    }
})








export const tokenModel = mongoose.model('Token', TokenSchema)