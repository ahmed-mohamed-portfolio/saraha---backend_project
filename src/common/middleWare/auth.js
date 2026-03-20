import { decodeToken } from '../security/security.js'
import { BadRequestException, UnauthorizedException } from '../utils/responce/error.responce.js'
import { findById } from '../../database/database.service.js'
import { userModel } from '../../database/index.js'

export const authentication = async (req, res, next) => {

    let { authorization } = req.headers

    if (!authorization) {
        UnauthorizedException({ message: "un authorized" })
    }



    const [flag, token] = authorization.split(' ')

    switch (flag) {

        case "Basic":
            let data = Buffer.from(token, 'base64').toString()
            let [email, password] = data.split(':')
            console.log(email, " ", password);

            break;

        case 'Bearer':
            let decodedData = decodeToken(token)


            let user = await findById({ model: userModel, id: decodedData.id })

            if (new Date(user.credentialsUpdatedAt).getTime() > decodedData.iat * 1000) {
                return BadRequestException({ message: 'invalid token' })
            }




            req.userId = decodedData.id

            break;

        default:
            throw BadRequestException({ message: "missing authentication schema" })
            break;
    }

    next()

}




//!!! i need to complete it
export const authorization = (req, res, next) => {



    next()

}
