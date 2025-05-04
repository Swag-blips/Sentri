import { Request, Response } from "express";
import logger from "../utils/logger";

export const registerTenant = (req: Request, res: Response) => {
  logger.info("Tenant registered");
  try {
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: error });
  }
};
