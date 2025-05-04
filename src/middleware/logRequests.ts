import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

const logRequests = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming request: ${req.method} ${req.url} with ${req.body}`);
  next();
};

export default logRequests;
