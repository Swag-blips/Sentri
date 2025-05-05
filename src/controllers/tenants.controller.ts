import { Request, Response } from "express";
import logger from "../utils/logger";
import supabase from "../config/supabase";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import Cryptojs from "crypto-js";

export const registerTenant = async (req: Request, res: Response) => {
  logger.info("Tenant register endpoint hit");

  try {
    const { email, password, name } = req.body;
    const result = await supabase
      ?.from("Tenants")
      .select()
      .eq("email", email)
      .single();

    if (!result || (result.error?.code !== "PGRST116" && result.error)) {
      throw new Error(`Database error: ${result?.error?.message}`);
    }

    if (result.data) {
      res
        .status(409)
        .json({ success: false, message: "Tenant already exists" });
      return;
    }
    const hashedPassord = await argon2.hash(password);
    const generatedApiKey = uuidv4();
    const tenantId = uuidv4();

    const storeUser = await supabase?.from("Tenants").insert({
      email,
      name,
      password: hashedPassord,
      apiKey: Cryptojs.AES.encrypt(
        generatedApiKey,
        process.env.SECRET_KEY as string
      ).toString(),
      tenantId,
    });

    if (storeUser?.error) {
      throw new Error(
        `an error occured from userError ${JSON.stringify(storeUser.error)}`
      );
    }

    res
      .status(200)
      .json({ success: true, message: "user successfully created" });

    return;
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: error });
  }
};

export const getTenant = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;

    const tenant = await supabase
      ?.from("Tenants")
      .select()
      .eq("tenantId", tenantId)
      .limit(1)
      .single();

    if (tenant?.error) {
      res
        .status(400)
        .json({ success: false, message: `an error occured ${tenant.error}` });
      return;
    }

    if (!tenant) {
      res
        .status(404)
        .json({ success: false, message: "Tenant does not exist" });
      return;
    }

    res.status(200).json({ success: true, tenant: tenant.data });
    return
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: error });
  } 
};
