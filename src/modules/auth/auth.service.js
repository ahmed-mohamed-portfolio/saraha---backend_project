import { compareHash, generateHash } from '../../common/hash/hash.js'
import { ProviderEnums } from '../../common/index.js'
import { ConflictException, NotFoundException, UnauthorizedException } from '../../common/utils/responce/index.js'
import { find, findById, findOne, insertOne } from '../../database/database.service.js'
import { userModel } from '../../database/index.js'
import jwt from 'jsonwebtoken'




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



export const login = async (data) => {
    let { email, password } = data


    let existUser = await findOne({ model: userModel, filter: { email, provider: ProviderEnums.System } })

    if (existUser) {

        let isMatched = compareHash(password, existUser.password)
        if (isMatched) {

            let token = jwt.sign({ id: existUser._id }, "route", { expiresIn: '1d' })
            console.log(existUser._id);

            console.log(token);

            return { existUser, token }
        }
    }

    return NotFoundException({ message: "user not found" })

}



export const getUserById = async (headers) => {

    let { authorization } = headers

    if (!authorization) {
        UnauthorizedException({ message: "un authorized" })
    }
    
    let decoded = jwt.verify(authorization, "route")

    let userData = await findById({ model: userModel, id: decoded.id })
    if (userData) {
        return userData
    }

    return NotFoundException({ message: "user not found" })

}

