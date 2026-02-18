import { ProviderEnums } from '../../common/index.js'
import { ConflictException, NotFoundException } from '../../common/utils/responce/index.js'
import { userModel } from '../../database/index.js'


export const signup = async (data) => {
    let { userName, email, password } = data

    let existUser = await userModel.findOne({ email })
    if (existUser) {
        return ConflictException({ message: "User Already Exists" })
    }

    

    let addedUser = await userModel.insertOne({ userName, email, password })
    return addedUser
}



export const login = async (data) => {
    let { email, password } = data

    let existUser = await userModel.findOne({ email, password , provider:ProviderEnums.System})
    if (existUser) {
        return existUser
    }

   return NotFoundException({message:"user not found"})

}