import { Request, Response } from "express";
import logger from "../utils/logger";
import convexClient from "../config/convex";

export const registerTenant = async (req: Request, res: Response) => {
  try {
    const { name, password, email } = req.body;

    const existingUser = await convexClient?.query()
  } catch (error) {
    logger.error(error);
  }
};
