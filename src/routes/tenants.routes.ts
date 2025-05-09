import { Router } from "express";
import validateRequest from "../middleware/validateSchema";
import {
  loginTenantSchema,
  registerTenantSchema,
  updateTenatSchema,
} from "../utils/validator";
import {
  getMe,
  loginTenant,
  registerTenant,
  updateMe,
} from "../controllers/tenants.controller";
import authenticateRequest from "../middleware/authenticateRequest";

const router = Router();

router.post("/register", validateRequest(registerTenantSchema), registerTenant);
router.post("/login", validateRequest(loginTenantSchema), loginTenant);
router.get("/me", authenticateRequest, getMe);
router.put(
  "/me",
  validateRequest(updateTenatSchema),
  authenticateRequest,
  updateMe
);

export default router;
