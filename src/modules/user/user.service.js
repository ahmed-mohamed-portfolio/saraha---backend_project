import { base_url } from "../../../config/config.service.js"
import { generateHash } from "../../common/hash/hash.js"
import { BadRequestException } from "../../common/utils/responce/error.responce.js"
import { findOneAndDelete, findOneAndUpdate } from "../../database/database.service.js"
import { userModel } from "../../database/index.js"



export const updateProfile = async (userId, data, file) => {
    let { firstName, lastName, email, password, phone, dateOfBirth, gender, shareProfileName } = data
    let updatedData = {}
    let hashedPassword
    if (password) {
        hashedPassword = await generateHash(password)
        console.log("password", password);
    }


    firstName ? updatedData.firstName = firstName : null
    lastName ? updatedData.lastName = lastName : null
    email ? updatedData.email = email : null
    password ? updatedData.hashedPassword = hashedPassword : null
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





export const deleteProfile = async (userId) => {

    let userData = await findOneAndDelete({ model: userModel, filter: { _id: userId } })
    if (userData) {
        return userData
    } else {
        throw BadRequestException("user not found")
    }
}