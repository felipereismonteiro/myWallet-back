import Joi from "joi";

export const exitSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.number().required(),
  description: Joi.string().required(),
  typeof: Joi.string().required(),
  date: Joi.string().min(3).required(),
});

export const entrySchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.number().required(),
  description: Joi.string().required(),
  typeof: Joi.string().required(),
  date: Joi.string().min(3).required(),
});
