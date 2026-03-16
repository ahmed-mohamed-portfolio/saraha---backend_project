import { BadRequestException } from "../../common/utils/responce/error.responce.js"



export const validation = (schema) => {

    return (req, res, next) => {
        let { value, error } = schema.validate(req.body, { abortEarly: false })

        if (error) {
            throw BadRequestException({ message: "validation error", extra: error })
        }

        next()
    }

}