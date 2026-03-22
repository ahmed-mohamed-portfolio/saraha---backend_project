import { compareHash, generateHash } from '../../common/hash/hash.js'
import { ProviderEnums } from '../../common/index.js'
import { BadRequestException, ConflictException, NotFoundException } from '../../common/utils/responce/index.js'
import { findById, findByIdAndUpdate, findOne, insertOne } from '../../database/database.service.js'
import { userModel } from '../../database/index.js'
import jwt from 'jsonwebtoken'
import { base_url, gmail_client_id, jwt_admin_signature, jwt_user_signature } from '../../../config/index.js'
import { decodeRefreshToken, generateToken } from '../../common/security/security.js'
import { OAuth2Client } from 'google-auth-library';
import crypto from "node:crypto"
import { deleteByPattern, deleteKey, keys, set, get } from "../../common/services/index.js"

import { event } from "../../common/utils/email/email.events.js"

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

    //? send gmail verify code
    event.emit("verifyEmail", { userId: addedUser._id, email })

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
            shareProfileName: payload.given_name + payload.family_name + payload.sub,
            isVerfied: true
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

    let decodedData = await decodeRefreshToken(token)

    let signature = undefined

    switch (decodedData.aud) {
        case "Admin":
            signature = jwt_admin_signature
            break;

        case "User":
            signature = jwt_user_signature
            break;
    }

    let jwtid = crypto.randomBytes(10).toString("hex")

    let accessToken = jwt.sign({ id: decodedData.id, firstName: decodedData.firstName, lastName: decodedData.lastName, email: decodedData.email }, signature, {
        expiresIn: '1m',
        audience: decodedData.aud,
        jwtid
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

export const logOutFromAllDevices = async (userId) => {


    let user = await findByIdAndUpdate({ model: userModel, id: userId, data: { credentialsUpdatedAt: new Date() }, select: '_id' })

    //THIS IS A saver way =>  // await deleteByPattern(`RevokeToken::${userId}::`)
    await deleteKey(await keys(`RevokeToken::${userId}::`))

    if (!user) {
        return NotFoundException({ message: "user not found" })
    }


    return true
}

export const logOut = async (userId, jti) => {




    let addToken = await set({
        key: `RevokeToken::${userId}::${jti}`,
        value: jti,
        ttl: 31536000
    })


    if (!addToken) {
        return BadRequestException({ message: "cant add token" })
    }




    return addToken

}



export const verifyEmail = async (data) => {
    let { email, code } = data


    let user = await findOne({ model: userModel, filer: { email } })

    if (!user) {
        return NotFoundException({ message: "email not found" })
    }

    if (user.isVerfied) {
        return ConflictException({ message: "email already verified" })
    }

    let redisCode = await get(`OTP::${user._id}`)


    if (await compareHash(code, redisCode)) {
        let userData = await findByIdAndUpdate({ model: userModel, id: user._id, data: { isVerfied: true }, select: '-password', options: { new: true } })
        return userData
    }

    return BadRequestException({ message: "code not right" })
}