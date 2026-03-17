import { compareHash, generateHash } from '../../common/hash/hash.js'
import { ProviderEnums } from '../../common/index.js'
import { BadRequestException, ConflictException, NotFoundException } from '../../common/utils/responce/index.js'
import { findById, findOne, insertOne } from '../../database/database.service.js'
import { userModel } from '../../database/index.js'
import jwt from 'jsonwebtoken'
import { base_url, gmail_client_id, jwt_admin_signature, jwt_user_signature } from '../../../config/index.js'
import { decodeRefreshToken, generateToken } from '../../common/security/security.js'
import { OAuth2Client } from 'google-auth-library';



export const signup = async (data, file) => {

    let { userName, email, password, phone, dateOfBirth, gender, shareProfileName } = data

    switch (gender) {
        case 'female': gender = 1
            break;

        default: gender = 0
            break;
    }


    let existUser = await findOne({ model: userModel, filter: { email } })
    if (existUser) {
        return ConflictException({ message: "User Already Exists" })
    }

    let profileName = await findOne({ model: userModel, filter: { shareProfileName } })
    if (profileName) {
        return ConflictException({ message: "profile Name Already Exists .. Try Another One" })
    }


    let image = '';
    if (file) {
        image = `${base_url}${file.path}`
    }

    let hashedPassword = await generateHash(password)

    let addedUser = await insertOne({ model: userModel, data: { userName, email, password: hashedPassword, phone, dateOfBirth, gender, shareProfileName, profilePicture: image } })
    return addedUser
}

const VerifyGoogleAccount = async (idToken) => {

    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: gmail_client_id,
    });
    const payload = ticket.getPayload();

    if (!payload.email_verified) {
        throw BadRequestException({ message: "fail to verify by google" })
    }


    return payload;
}

const loginWithGmail = async (idToken, issuer) => {

    const payload = await VerifyGoogleAccount(idToken)

    const user = await findOne({ model: userModel, filter: { email: payload.email, provider: ProviderEnums.Google } })


    if (!user) {
        throw NotFoundException({ message: "not registered account" })
    }


    let { accessToken, refreshToken } = generateToken(user, issuer)

    let data = { user, accessToken, refreshToken }
    return { message: "user logged in successfully", status: 200, data };


}

export const signupWithGmail = async (idToken, issuer) => {

    const payload = await VerifyGoogleAccount(idToken)

    const checkExist = await findOne({ model: userModel, filter: { email: payload.email } })

    if (checkExist) {
        if (checkExist.provider == ProviderEnums.System) {
            throw ConflictException({ message: "invalid login porvider" })
        }

        return loginWithGmail(idToken, issuer)
    }


    const user = await insertOne({
        model: userModel, data: {
            firstName: payload.given_name,
            lastName: payload.family_name,
            email: payload.email,
            profilePicture: payload.picture,
            confireEmail: new Date(),
            provider: ProviderEnums.Google,
            shareProfileName: payload.given_name + payload.family_name + payload.sub

        }
    })
    let { accessToken, refreshToken } = generateToken(user, issuer)

    let data = { user, accessToken, refreshToken }

    return { message: "user added", status: 201, data };
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


    let accessToken = jwt.sign({ id: decodedData.id, firstName: decodedData.firstName, lastName: decodedData.lastName, email: decodedData.email }, signature, {
        expiresIn: '1m',
        audience: decodedData.aud
    })



    return accessToken


}

export const getUserById = async (userId) => {

    let userData = await findById({ model: userModel, id: userId, select: '-password' })
    if (userData) {
        return userData
    }

    return NotFoundException({ message: "user not found" })

}

export const sharedUser = async (profileName) => {

    let userData = await findOne({ model: userModel, filter: { shareProfileName: profileName }, select: "-password -role -provider" })
    if (userData) {
        return userData

    }

    return NotFoundException({ message: "user not found" })

}