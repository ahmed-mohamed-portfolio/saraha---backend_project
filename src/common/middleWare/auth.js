import { decodeToken } from '../security/security.js'
import { BadRequestException, UnauthorizedException } from '../utils/responce/error.responce.js'
import { findById } from '../../database/database.service.js'
import { userModel } from '../../database/index.js'
import { get } from '../services/redis.service.js'

export const authentication = async (req, res, next) => {


    if (!req.cookies.accessToken) {
        UnauthorizedException({ message: "un authorized" })
    }

    let decodedData = decodeToken(req.cookies.accessToken)


    let user = await findById({ model: userModel, id: decodedData.id })

    if (Math.floor(new Date(user.credentialsUpdatedAt).getTime() / 1000) > decodedData.iat) {
        return BadRequestException({ message: 'invalid token22' })
    }


    req.userId = decodedData.id
    req.jti = decodedData.jti

    let blocked_Token = await get(`RevokeToken::${req.userId}::${req.jti}`)
    if (blocked_Token !== null) {
        return BadRequestException({ message: 'invalid token (blocked 1)' })
    }



    next()

}




//!!! i need to complete it
export const authorization = (req, res, next) => {



    next()

}
