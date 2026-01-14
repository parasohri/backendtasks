import ActivityLog from "../models/Activitylog.model.js";
import Team from "../models/Team.model.js";

 
export const getActivityLogs = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    
    if (!team.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const logs = await ActivityLog.find({ team: teamId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("performedBy", "email")
      .populate("task", "title");

    const total = await ActivityLog.countDocuments({ team: teamId });

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      logs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
