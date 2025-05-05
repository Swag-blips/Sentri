import { Router } from "express";
import validateRequest from "../middleware/validateSchema";
import { registerTenantSchema } from "../utils/validator";
import { getTenant, registerTenant } from "../controllers/tenants.controller";
import authenticateRequest from "../middleware/authenticateRequest";

const router = Router();

router.post("/register", validateRequest(registerTenantSchema), registerTenant);
router.get("/", authenticateRequest, getTenant);
// router.get("/all");
// router.put("/:id");
// router.delete("/:id");

export default router;
