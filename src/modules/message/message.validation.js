import Joi from "joi";

export const messageSchema = Joi.object().keys({

    message: Joi.string().required().messages({
        "string.base": "message must be a string",
        "string.empty": "message cannot be empty",
        "any.required": "message is required"
    }),



})
