import Joi from "joi";

export const signupSchema = Joi.object().keys({
    userName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/).required(),
    gender: Joi.string().valid("male", "female"),
    dateOfBirth: Joi.date(),
    phone: Joi.string().pattern(new RegExp(/^(00201|\+20|01)[0|1|2|5]\d{8}$/)).required(),
    rePassword: Joi.string().valid(Joi.ref("password")).required(),

})


export const signinSchema = Joi.object().keys({
    email: Joi.string().email().required().messages({
        "string.email": "invalid email format",
        "any.required": "email is required",
        "string.empty": "email cannot be empty"
    }),
    password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/).required(),

})