import { Router } from "express";

const router = Router();

router.post("/healthCheck", (req, res) => {
  res.status(200).json({ success: true, message: "Health check succesfully" });
  return;
});
// router.get("/:id");
// router.get("/all");
// router.put("/:id");
// router.delete("/:id");

export default router;
