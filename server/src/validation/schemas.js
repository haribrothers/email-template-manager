import Joi from 'joi';

export const templateSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  content: Joi.string().required(),
  variables: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('string', 'number', 'array', 'json').required(),
    defaultValue: Joi.any().required(),
    description: Joi.string(),
    required: Joi.boolean().required()
  }))
});

export const partialSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  content: Joi.string().required(),
  description: Joi.string(),
  category: Joi.string()
});

export const variableSchema = Joi.object({
  name: Joi.string().required().min(1).max(50),
  type: Joi.string().valid('string', 'number', 'array', 'json').required(),
  defaultValue: Joi.any().required(),
  description: Joi.string(),
  required: Joi.boolean().required()
});