import Joi from "joi";

export const signupSchema = Joi.object().keys(
    {

        userName: Joi.string().min(3).max(50).required().messages({
            "string.base": "Username must be a text value",
            "string.empty": "Username cannot be empty",
            "string.min": "Username must contain at least 3 characters",
            "string.max": "Username cannot exceed 50 characters",
            "any.required": "Username is required"
        }),

        email: Joi.string().email().required().messages({
            "string.base": "Email must be a valid text",
            "string.email": "Invalid email format",
            "string.empty": "Email cannot be empty",
            "any.required": "Email is required"
        }),

        password: Joi.string()
            .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
            .required()
            .messages({
                "string.base": "Password must be a string",
                "string.empty": "Password cannot be empty",
                "string.pattern.base":
                    "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
                "any.required": "Password is required"
            }),

        rePassword: Joi.string().valid(Joi.ref("password")).required().messages({
            "any.only": "Password confirmation does not match the password",
            "string.empty": "Password confirmation cannot be empty",
            "any.required": "Password confirmation is required"
        }),

        gender: Joi.string().valid("male", "female").messages({
            "any.only": "Gender must be either male or female",
            "string.base": "Gender must be a string"
        }),

        dateOfBirth: Joi.date().messages({
            "date.base": "Date of birth must be a valid date"
        }),

        phone: Joi.string()
            .pattern(/^(00201|\+20|01)[0|1|2|5]\d{8}$/)
            .required()
            .messages({
                "string.base": "Phone number must be a string",
                "string.empty": "Phone number cannot be empty",
                "string.pattern.base":
                    "Invalid Egyptian phone number format",
                "any.required": "Phone number is required"
            }),

        shareProfileName: Joi.string()
            .pattern(/^[a-z0-9]+$/)
            .required()
            .messages({
                "string.base": "Profile name must be a string",
                "string.empty": "Profile name cannot be empty",
                "string.pattern.base":
                    "Profile name can only contain lowercase letters and numbers without spaces",
                "any.required": "Profile name is required"
            })

    }
)


export const signinSchema = Joi.object().keys({

    email: Joi.string().email().required().messages({
        "string.base": "Email must be a string",
        "string.email": "Invalid email format",
        "string.empty": "Email cannot be empty",
        "any.required": "Email is required"
    }),

    password: Joi.string()
        .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
        .required()
        .messages({
            "string.base": "Password must be a string",
            "string.empty": "Password cannot be empty",
            "string.pattern.base":
                "Password must contain at least 8 characters including uppercase, lowercase, number, and special character",
            "any.required": "Password is required"
        })

})










