import { Router } from "express";
import validateRequest from "../middleware/validateSchema";
import { loginTenantSchema, registerTenantSchema } from "../utils/validator";
import {
  getMe,
  loginTenant,
  registerTenant,
} from "../controllers/tenants.controller";

const router = Router();

router.post("/register", validateRequest(registerTenantSchema), registerTenant);
router.post("/login", validateRequest(loginTenantSchema), loginTenant);
router.get("/me", getMe);

// router.get("/all");
// router.put("/:id");
// router.delete("/:id");

export default router;
