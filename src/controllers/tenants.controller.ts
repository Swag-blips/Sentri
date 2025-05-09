import { Request, Response } from "express";
import logger from "../utils/logger";
import convexClient from "../config/convex";
import { v4 as uuid } from "uuid";
import api from "../../convex/_generated/api";
import argon2 from "argon2";
import CryptoJS from "crypto-js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";

export const registerTenant = async (req: Request, res: Response) => {
  try {
    const { name, password, email } = req.body;

    const user = await convexClient?.query(api.api.tenant.getTenant, {
      email,
    });

    if (user) {
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
    const tenant = (await convexClient?.mutation(api.api.tenant.storeTenant, {
      name,
      email,
      password: hashedPassword,
      tenantId,
      apiKey,
    })) as string;

    const accessToken = generateAccessToken(tenant, tenantId);
    const refreshToken = generateRefreshToken(tenant, tenantId);

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        tenant,
      },
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const loginTenant = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await convexClient?.query(api.api.tenant.getTenant, {
      email,
    });

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const verifyPassword = await argon2.verify(user.password, password);

    if (!verifyPassword) {
      res.status(400).json({ success: false, message: "invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(user._id, user.tenantId);

    const refreshToken = generateRefreshToken(user._id, user.tenantId);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        refreshToken,
        accessToken,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;

    const tenant = await convexClient?.query(api.api.tenant.getTenantMe, {
      tenantId,
    });

    if (!tenant) {
      res.status(404).json({ success: false, message: "Tenant not found" });
      return;
    }

    if (tenant.tenantId !== tenantId) {
      res.status(401).json({ success: false, messsage: "unautorized access" });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        _id: tenant._id,
        email: tenant.email,
        name: tenant.name,
        tenantId: tenant.tenantId,
      },
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    const { name, email } = req.body;

    const tenant = await convexClient?.query(api.api.tenant.getTenantMe, {
      tenantId,
    });

    if (!tenant) {
      res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
      return;
    }

    if (tenant.tenantId !== tenantId) {
      res.status(401).json({ success: false, message: "Unauthorized access" });
      return;
    }

    await convexClient?.mutation(api.api.tenant.updateTenant, {
      id: tenant._id,
      name: name || tenant.name,
      email: email || tenant.email,
    });

    res
      .status(201)
      .json({ success: true, message: "Details updated sucessfull" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: error });
  }
};
