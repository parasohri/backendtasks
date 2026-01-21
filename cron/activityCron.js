import cron from "node-cron";
import ActivityLog from "../models/Activitylog.model.js";

 
export const activityCleanupJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

      const result = await ActivityLog.deleteMany({
        createdAt: { $lt: new Date(Date.now() - THIRTY_DAYS) },
      });

      console.log(
        `[CRON] Deleted ${result.deletedCount} old activity logs`
      );
    } catch (error) {
      console.error("[CRON] Activity cleanup failed:", error.message);
    }
  });
};
