import { compareHash, generateHash } from '../../common/hash/hash.js'
import { ProviderEnums } from '../../common/index.js'
import { ConflictException, NotFoundException } from '../../common/utils/responce/index.js'
import { findOne, insertOne } from '../../database/database.service.js'
import { userModel } from '../../database/index.js'





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


    let existUser = await findOne({ model: userModel, filter: { email, provider: ProviderEnums.System }, select: '-_id' })

    if (existUser) {

        let isMatched = compareHash(password, existUser.password)
        if (isMatched) {
            return existUser
        }
    }

    return NotFoundException({ message: "user not found" })

}



