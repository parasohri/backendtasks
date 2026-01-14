import Task from "../models/Task.model.js";
import Team from "../models/Team.model.js";
export const createTask=async(req,res)=>{
    try {
        const {teamId}=req.params;
        const {title,description,assignedTo}=req.body;
        if(!title||!description||!teamId){
            return res.status(400).json({message:"Title, description and teamId are required"});
        }
        const team=await Team.findById(teamId);
        if(!team){
            return res.status(404).json({message:"Team not found"});
        }
        const task=new Task.Task({
            title,
            description,
            team:teamId,
            assignedTo,
        });
        await task.save();
        return res.status(201).json({message:"Task created successfully",task});
    } catch (error) {
        console.error("Error creating task:",error);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const getTasks=async(req,res)=>{
    try {
        const {teamId}=req.params;
        const tasks=await Task.Task.find({team:teamId}).populate('assignedTo','name email').populate('comments.createdBy','name email');
        return res.status(200).json({tasks});
    } catch (error) {
        console.error("Error fetching tasks:",error);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const updateTask=async(req,res)=>{
    try {
        const {taskId}=req.params;
        const task=await Task.Task.findById(taskId);
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        const team=await Team.findById(task.team);
        if(!team.members.includes(req.user.id)){
            return res.status(403).json({message:"Only team members can update tasks"});
        }
        Object.assign(task,req.body);
        await task.save();
        return res.status(200).json({message:"Task updated successfully",task});
    } catch (error) {
        console.error("Error updating task:",error);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const moveTask=async(req,res)=>{
    try {
        const {taskId}=req.params;
        const {status}=req.body;
        if(!['TODO','DOING','DONE'].includes(status)){
            return res.status(400).json({message:"Invalid status"});
        }
        const task=await Task.Task.findById(taskId);
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        const team=await Team.findById(task.team);
        if(!team.members.includes(req.user.id)){
            return res.status(403).json({message:"Only team members can move tasks"});
        }
        task.status=status;
        await task.save();
        return res.status(200).json({message:"Task moved successfully",task});
    } catch (error) {
        console.error("Error moving task:",error);
        return res.status(500).json({message:"Internal server error"});
    }   
}
export const assignTask=async(req,res)=>{
    try {
        const {taskId}=req.params;
        const {userId}=req.body;
        const task=await Task.Task.findById(taskId);
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        task.assignedTo=userId;
        await task.save();
        return res.status(200).json({message:"Task assigned successfully",task});
    } catch (error) {
        console.error("Error assigning task:",error);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const addComment=async(req,res)=>{
    try {
        const {taskId}=req.params;
        const {text}=req.body;
        if(!text){
            return res.status(400).json({message:"Comment text is required"});
        }
        const task=await Task.Task.findById(taskId);
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        task.comments.push({
            text,
            createdBy:req.user.id,
        });
        await task.save();
        return res.status(200).json({message:"Comment added successfully",task});
    } catch (error) {
        console.error("Error adding comment:",error);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const deleteTask=async(req,res)=>{
    try {
        const {taskId}=req.params;
        const task=await Task.Task.findById(taskId);
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        const team=await Team.findById(task.team);
        if(!team.members.includes(req.user.id)){
            return res.status(403).json({message:"Only team members can delete tasks"});
        }
        await Task.Task.findByIdAndDelete(taskId);
        return res.status(200).json({message:"Task deleted successfully"});
    } catch (error) {
        console.error("Error deleting task:",error);
        return res.status(500).json({message:"Internal server error"});
    }
}