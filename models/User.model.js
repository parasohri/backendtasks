import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
userSchema.index({ email: 1 });
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword=async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword,this.password);
};
const User = mongoose.model("User", userSchema);
export default User;    
//there are two scops find user by mail or name for indexing for fast search i think it should be email as mentioned in test