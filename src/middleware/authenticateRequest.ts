import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export default authenticateRequest;
