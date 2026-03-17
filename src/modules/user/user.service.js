import { base_url } from "../../../config/config.service.js"
import { BadRequestException } from "../../common/utils/responce/error.responce.js"
import { findOneAndUpdate } from "../../database/database.service.js"
import { userModel } from "../../database/index.js"



export const updateProfile = async (userId, data, file) => {
    let { firstName, lastName, email, password, phone, dateOfBirth, gender, shareProfileName } = data
    let updatedData = {}

    firstName ? updatedData.firstName = firstName : null
    lastName ? updatedData.lastName = lastName : null
    email ? updatedData.email = email : null
    password ? updatedData.password = password : null
    phone ? updatedData.phone = phone : null
    dateOfBirth ? updatedData.dateOfBirth = dateOfBirth : null
    gender ? updatedData.gender = gender : null
    shareProfileName ? updatedData.shareProfileName = shareProfileName : null

    if (file) {
        updatedData.profilePicture = `${base_url}${file.path}`
    }

    let existUser = await findOneAndUpdate({ model: userModel, filter: { _id: userId }, data: updatedData, options: { new: true }, select: '-password -gender -provider -role -__v' })

    if (existUser) {
        return existUser
    }

    BadRequestException({ message: "user not found" })
}