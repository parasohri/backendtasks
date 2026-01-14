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
        required:true
    },
    action:{
        type:String,
        enum:["CREATED","UPDATED","MOVED","ASSIGNED"],
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

 const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
 export default ActivityLog;
    