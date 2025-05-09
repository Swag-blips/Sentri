import Joi from "joi";

export const registerTenantSchema = Joi.object({
  name: Joi.string().required().max(100),
  email: Joi.string().email().required().max(254),
  password: Joi.string().min(6).required(),
});

export const loginTenantSchema = Joi.object({
  email: Joi.string().required().max(254),
  password: Joi.string().min(6).required(),
});

export const updateTenatSchema = Joi.object({
  email: Joi.string().optional().max(254),
  name: Joi.string().optional().max(100),
});
