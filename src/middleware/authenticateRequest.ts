import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Id } from "../../convex/_generated/dataModel";
import logger from "../utils/logger";

interface DecodedTenantJwt {
  userId: Id<"tenants">;
  tenantId: string;
}
const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(400).json({ success: false, message: "tenantId required" });
      return;
    }

    const decodedToken = jwt.verify(
      token,
      process.env.SECRET_KEY as string
    ) as DecodedTenantJwt;

    if (decodedToken) {
      req.tenantId = decodedToken.tenantId;
      next();
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ success: false, message: "Token has expired" });
        return;
      } else if (error.name === "JsonWebTokenError") {
        res.status(401).json({ success: false, message: "invalid Jwt" });
      } else {
        res.status(500).json({ message: error });
        logger.error(error);
        return;
      }
    }
  }
};

export default authenticateRequest;
