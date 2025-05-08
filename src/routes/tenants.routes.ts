import { Router } from "express";
import validateRequest from "../middleware/validateSchema";
import { loginTenantSchema, registerTenantSchema } from "../utils/validator";
import {
  getMe,
  loginTenant,
  registerTenant,
} from "../controllers/tenants.controller";
import authenticateRequest from "../middleware/authenticateRequest";

const router = Router();

router.post("/register", validateRequest(registerTenantSchema), registerTenant);
router.post("/login", validateRequest(loginTenantSchema), loginTenant);
router.get("/me", authenticateRequest, getMe);

// router.get("/all");
// router.put("/:id");
// router.delete("/:id");

export default router;
