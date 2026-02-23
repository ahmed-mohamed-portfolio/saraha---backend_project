import jwt from 'jsonwebtoken'
import { jwt_admin_signature, jwt_user_signature } from '../../../config/index.js'


export const auth = (req, res, next) => {

    let { authorization } = req.headers

    if (!authorization) {
        UnauthorizedException({ message: "un authorized" })
    }

    let decoded = jwt.decode(authorization)

    let signature = undefined

    switch (decoded.aud) {
        case "Admin":
            signature = jwt_admin_signature
            break;

        default:
            signature = jwt_user_signature
            break;
    }

    let decodedData = jwt.verify(authorization, signature)

    req.userId = decodedData.id

    next()

}