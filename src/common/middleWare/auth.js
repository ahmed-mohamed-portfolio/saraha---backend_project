import jwt from 'jsonwebtoken'
import { decodeToken } from '../security/security.js'


export const auth = (req, res, next) => {

    let { authorization } = req.headers

    if (!authorization) {
        UnauthorizedException({ message: "un authorized" })
    }

    let decodedData = decodeToken(authorization)

    req.userId = decodedData.id

    next()

}
