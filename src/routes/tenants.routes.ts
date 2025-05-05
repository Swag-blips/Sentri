import { Router } from "express";
import validateRequest from "../middleware/validateSchema";
import { registerTenantSchema } from "../utils/validator";
import { registerTenant } from "../controllers/tenants.controller";

const router = Router();

router.post("/register", validateRequest(registerTenantSchema), registerTenant);
// router.get("/:id", getTenant);

// router.get("/all");
// router.put("/:id");
// router.delete("/:id");

export default router;
