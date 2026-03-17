import { base_url } from "../../../config/config.service.js"
import { BadRequestException, NotFoundException } from "../../common/utils/responce/error.responce.js"
import { find, findById, findByIdAndDelete, findOne, findOneAndDelete, insertOne } from "../../database/database.service.js"
import { userModel } from "../../database/index.js"
import { messageModel } from "../../database/model/message.model.js"



export const sendMessage = async (body, userId, file) => {

    let { message } = body

    const user = await findById({ model: userModel, id: userId })
    if (!user) {
        return NotFoundException({ message: "user not found" })
    }

    let image = ''
    if (file) {
        image = `${base_url}${file.path}`
    }
    const addMessage = await insertOne({ model: messageModel, data: { message, image, receverId: userId } })
    if (!message) {
        BadRequestException({ message: "message not sent" })
    }

    return addMessage


}

export const getAllMessages = async (userId) => {

    let existedUser = await findById({ model: userModel, id: userId })
    if (!existedUser) {
        return BadRequestException('invalid user')
    }

    let messages = await find({ model: messageModel, filter: { receverId: userId }, select: 'message image' })

    if (!messages.length) {
        return []
    }

    return messages.reverse()

}

export const getMessageById = async (messageId) => {
    const message = await findOne({ model: messageModel, filter: { _id: messageId } })
    if (!message) {
        BadRequestException({ message: "message not found" })
    }

    return message
}

export const deleteMessage = async (messageId, userId) => {
    const message = await findOneAndDelete({ model: messageModel, filter: { _id: messageId, receverId: userId } })
    if (!message) {
        BadRequestException('message not found')
    }

    return message
}