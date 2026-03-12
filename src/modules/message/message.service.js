import { BadRequestException, NotFoundException } from "../../common/utils/responce/error.responce.js"
import { findById, insertOne } from "../../database/database.service.js"
import { userModel } from "../../database/index.js"
import { messageModel } from "../../database/model/message.model.js"



export const sendMessage = async (body, userId) => {

    let { message, image } = body

    const user = await findById({ model: userModel, id: userId })
    if (!user) {
        return NotFoundException({ message: "user not found" })
    }

    const addMessage = await insertOne({ model: messageModel, data: { message, image, receverId: userId } })
    if (!message) {
        BadRequestException({ message: "message not sent" })
    }

    return message


}