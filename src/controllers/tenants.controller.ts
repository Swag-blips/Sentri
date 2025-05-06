import { Request, Response } from "express";
import logger from "../utils/logger";
import convexClient from "../config/convex";
import api from "../../convex/_generated/api";
import argon2 from "argon2";

export const registerTenant = async (req: Request, res: Response) => {
  try {
    const { name, password, email } = req.body;

    const existingUser = await convexClient?.query(api.api.tenant.getTenant, {
      email,
    });

    if (existingUser) {
      res
        .status(409)
        .json({ success: false, message: "Tenant already exists" });

      return;
    }

    const hashedPassword = argo;
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
