import { ErrorRequestHandler } from "express";
import logger from "./logger";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err.stack);

  res
    .status(500)
    .json({ success: false, message: err.message || "Internal server error" });

  next();
};

export default errorHandler;
