import { compareHash, generateHash } from '../../common/hash/hash.js'
import { GenderEnums, ProviderEnums } from '../../common/index.js'
import { ConflictException, NotFoundException, UnauthorizedException } from '../../common/utils/responce/index.js'
import { findById, findOne, insertOne } from '../../database/database.service.js'
import { userModel } from '../../database/index.js'
import jwt from 'jsonwebtoken'
import { jwt_admin_signature, jwt_key, jwt_user_signature } from '../../../config/index.js'
import { decodeRefreshToken, generateToken } from '../../common/security/security.js'



export const signup = async (data) => {
    let { userName, email, password, phone, dateOfBirth, gender } = data

    let existUser = await findOne({ model: userModel, filter: { email } })
    if (existUser) {
        return ConflictException({ message: "User Already Exists" })
    }

    let hashedPassword = await generateHash(password)

    let addedUser = await insertOne({ model: userModel, data: { userName, email, password: hashedPassword, phone, dateOfBirth, gender: GenderEnums.gender } })
    return addedUser
}


export const login = async (data, issuer) => {
    let { email, password } = data


    let existUser = await findOne({ model: userModel, filter: { email, provider: ProviderEnums.System } })

    if (existUser) {


        let isMatched = await compareHash(password, existUser.password)

        if (isMatched) {

            let { accessToken, refreshToken } = generateToken(existUser, issuer)


            return { existUser, accessToken, refreshToken }
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


export const generateAccessToken = async (token) => {

    let decodedData = decodeRefreshToken(token)

    let signature = undefined

    switch (decodedData.aud) {
        case "Admin":
            signature = jwt_admin_signature
            break;

        case "User":
            signature = jwt_user_signature
            break;
    }


    let accessToken = jwt.sign({ id: decodedData.id }, signature, {
        expiresIn: '30m',
        audience: decodedData.aud
    })



    return accessToken


}