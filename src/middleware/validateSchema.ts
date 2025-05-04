import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";
import logger from "../utils/logger";

const validateRequest =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.details.map((detail) => detail.message),
      });
      logger.error(error);
      return;
    }

    next();
  };

export default validateRequest;
