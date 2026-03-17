import { BadRequestException } from "../../common/utils/responce/error.responce.js"



export const validation = (schema) => {


    return (req, res, next) => {

        const body = req.body.registerForm
            ? JSON.parse(req.body.registerForm)
            : req.body


        let { value, error } = schema.validate(body, { abortEarly: false })

        if (error) {
            throw BadRequestException({ message: "validation error", extra: error })
        }

        next()
    }

}