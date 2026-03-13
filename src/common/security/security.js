import { jwt_admin_refresh_signature, jwt_admin_signature, jwt_user_refresh_signature, jwt_user_signature } from "../../../config/index.js"
import jwt from 'jsonwebtoken'



export const generateToken = (existUser, issuer) => {

    let audience = undefined
    let signature = undefined
    let refreshSignature = undefined

    switch (existUser.role) {
        case "0":
            signature = jwt_admin_signature
            refreshSignature = jwt_admin_refresh_signature
            audience = "Admin"
            break;

        case "1":
            signature = jwt_user_signature
            refreshSignature = jwt_user_refresh_signature
            audience = "User"
            break;
    }

    //!i put it for test 1m
    let accessToken = jwt.sign({ id: existUser._id, firstName: existUser.firstName, lastName: existUser.lastName, email: existUser.email }, signature, {
        expiresIn: '100m',
        issuer,
        audience
    })

    console.log("accessToken", accessToken);


    let refreshToken = jwt.sign({ id: existUser._id, firstName: existUser.firstName, lastName: existUser.lastName, email: existUser.email }, refreshSignature, {
        expiresIn: '1y',
        audience
    })

    return { accessToken, refreshToken }
}





export const decodeToken = (token) => {

    let decoded = jwt.decode(token)

    let signature = undefined

    switch (decoded.aud) {
        case "Admin":
            signature = jwt_admin_signature
            break;

        default:
            signature = jwt_user_signature
            break;
    }

    let decodedData = jwt.verify(token, signature)

    return decodedData
}




export const decodeRefreshToken = (token) => {

    let decoded = jwt.decode(token)

    let refreshSignature = undefined

    switch (decoded.aud) {
        case "Admin":
            refreshSignature = jwt_admin_refresh_signature
            break;

        default:
            refreshSignature = jwt_user_refresh_signature
            break;
    }

    let decodedData = jwt.verify(token, refreshSignature)

    return decodedData
}