import { Request, Response } from "express";
import logger from "../utils/logger";
import convexClient from "../config/convex";
import { v4 as uuid } from "uuid";
import api from "../../convex/_generated/api";
import argon2 from "argon2";
import CryptoJS from "crypto-js";

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

    const hashedPassword = await argon2.hash(password);
    const apiKey = CryptoJS.AES.encrypt(
      uuid(),
      process.env.SECRET_KEY as string
    ).toString();

    const tenantId = uuid();
    const tenant = await convexClient?.mutation(api.api.tenant.storeTenant, {
      name,
      email,
      password: hashedPassword,
      tenantId,
      apiKey,
    });

    res.status(200).json({ success: true, message: tenant });
    return;
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
