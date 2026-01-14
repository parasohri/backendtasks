import express from "express";
import { getActivityLogs } from "../controllers/Activitylog.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

 
router.get(
  "/teams/:teamId/activity-logs",
  verifyToken,
  getActivityLogs
);

export default router;
