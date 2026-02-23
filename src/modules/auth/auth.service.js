import { compareHash, generateHash } from '../../common/hash/hash.js'
import { ProviderEnums } from '../../common/index.js'
import { ConflictException, NotFoundException, UnauthorizedException } from '../../common/utils/responce/index.js'
import { findById, findOne, insertOne } from '../../database/database.service.js'
import { userModel } from '../../database/index.js'
import jwt from 'jsonwebtoken'
import { jwt_admin_signature, jwt_key, jwt_user_signature } from '../../../config/index.js'



export const signup = async (data) => {
    let { userName, email, password } = data

    let existUser = await findOne({ model: userModel, filter: { email } })
    if (existUser) {
        return ConflictException({ message: "User Already Exists" })
    }

    let hashedPassword = await generateHash(password)

    let addedUser = await insertOne({ model: userModel, data: { userName, email, password: hashedPassword } })
    return addedUser
}


export const login = async (data, issuer) => {
    let { email, password } = data


    let existUser = await findOne({ model: userModel, filter: { email, provider: ProviderEnums.System } })

    if (existUser) {

        let audience = undefined
        let signature = undefined
        switch (existUser.role) {
            case "0":
                signature = jwt_admin_signature
                audience = "Admin"                
                break;

            case "1":
                signature = jwt_user_signature
                audience = "User"
                break;
        }

        let isMatched = await compareHash(password, existUser.password)
        
        if (isMatched) {

            let token = jwt.sign({ id: existUser._id }, signature, {
                expiresIn: '1d',
                notBefore: '2s',
                issuer,
                audience
            })
            

            return { existUser, token }
        }
    }

    return NotFoundException({ message: "user not found" })

}


export const getUserById = async (userId) => {

    let userData = await findById({ model: userModel, id: userId })
    if (userData) {
        return userData
    }

    return NotFoundException({ message: "user not found" })

}

