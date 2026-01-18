import mongoose from "mongoose";
const activityLogSchema = new mongoose.Schema(
  {
    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true
    },
    task:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task",
    },
    action:{
        type:String,
        enum: [
  "CREATED",
  "UPDATED",
  "MOVED",
  "ASSIGNED",
  "COMMENTED",
  "DELETED"
]
,
        required:true
    },
    performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true       },
        message:{
            type:String,
            
        }
  },
  { timestamps: true }
);
activityLogSchema.index({ team: 1, createdAt: -1 });


 const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
 export default ActivityLog;
    