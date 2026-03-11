import Joi from "joi";

export const taskSchema = Joi.object({
    name: Joi.string().min(5).max(25).required()
})