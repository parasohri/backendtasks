import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  { text:{
    type: String,
    required: true,     
  } ,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['TODO', 'DOING', 'DONE'],
      default: 'TODO',
    },
    comments:[commentSchema],
    team:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default {
  Task: mongoose.model("Task", taskSchema),
  Comment: mongoose.model("Comment", commentSchema)
    }