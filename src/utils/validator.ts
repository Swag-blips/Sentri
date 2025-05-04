import Joi from "joi";

export const registerTenantSchema = Joi.object({
  name: Joi.string().required().max(100),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});


