import Team from "../models/Team.model.js";
import ActivityLog from "../models/Activitylog.model.js";
export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ message: "Team name already exists" });
    }

    const team = new Team({
      name,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    await team.save();

    
    await ActivityLog.create({
      team: team._id,
      action: "CREATED",
      performedBy: req.user.id,
      message: `Team "${name}" created`,
    });

    return res.status(201).json({
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    console.error("Error creating team:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

 
export const addMember = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { memberId } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only team creator can add members" });
    }

    if (team.members.includes(memberId)) {
      return res.status(400).json({ message: "Member already in the team" });
    }

    team.members.push(memberId);
    await team.save();

     
    await ActivityLog.create({
      team: team._id,
      action: "ASSIGNED",
      performedBy: req.user.id,
      message: "A new member was added to the team",
    });

    return res.status(200).json({
      message: "Member added successfully",
      team,
    });
  } catch (error) {
    console.error("Error adding member:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

 
export const removeMember = async (req, res) => {
  try {
    const { teamId, userId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only team creator can remove members" });
    }

    team.members = team.members.filter(
      (member) => member.toString() !== userId
    );

    await team.save();

   
    await ActivityLog.create({
      team: team._id,
      action: "UPDATED",
      performedBy: req.user.id,
      message: "A member was removed from the team",
    });

    return res.status(200).json({
      message: "Member removed successfully",
      team,
    });
  } catch (error) {
    console.error("Error removing member:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

 
export const getTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId).populate(
      "members",
      "name email"
    );

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    
    if (!team.members.some((m) => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({ members: team.members });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
