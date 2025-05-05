import { NextFunction, Request, Response } from "express";
import supabase from "../config/supabase";
import logger from "../utils/logger";

const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tenantId = req.headers["x-tenant-id"];

  try {
    if (!tenantId) {
      res
        .status(401)
        .json({ success: false, message: "unauthorized access prevented" });
      return;
    }

    const tenant = await supabase
      ?.from("Tenants")
      .select("tenantId")
      .limit(1)
      .eq("tenantId", tenantId)
      .single();

    if (tenant?.error && tenant?.error.code === "PGRST116") {
      res.status(404).json({ success: false, message: "Tenant not found" });

      return;
    }

    if (tenant?.error) {
      res.status(400).json({ success: false, error: tenant.error });
      return;
    }

    if (!tenant?.data) {
      res.status(404).json({ success: false, message: "Tenant not found" });
      return;
    }

    req.tenantId = tenant.data.tenantId;

    next();
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

export default authenticateRequest;
