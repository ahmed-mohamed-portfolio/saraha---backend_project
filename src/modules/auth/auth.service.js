import { ProviderEnums } from '../../common/index.js'
import { ConflictException, NotFoundException } from '../../common/utils/responce/index.js'
import { findOne, insertOne } from '../../database/database.service.js'
import { userModel } from '../../database/index.js'


export const signup = async (data) => {
    let { userName, email, password } = data

    let existUser = await findOne({ model:userModel , filter:{email} })
    if (existUser) {
        return ConflictException({ message: "User Already Exists" })
    }

    

    let addedUser = await insertOne({model:userModel,data:{ userName, email, password }})
    return addedUser
}



export const login = async (data) => {
    let { email, password } = data


    let existUser = await findOne({model:userModel,filter:{ email, password , provider:ProviderEnums.System},select:'-_id -password'})

    if (existUser) {
        return existUser
    }

   return NotFoundException({message:"user not found"})

}