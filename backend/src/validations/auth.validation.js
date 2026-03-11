import Joi from "joi";

export const registerSchema = Joi.object({
    mail: Joi.string().email().required(),
    password: Joi.string().min(8).required()
})