import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import  {generateToken} from "../middleware/auth.js";
import redisClient from "../config/redis.config.js";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ name, email, password });
    const newj=await newUser.save();
    const token = generateToken(res,newj);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.log("ff",error);
    
    res.status(500).json({ message: "Server error" });
  }
}
export const signInUser = async (req, res) => {
  try {
    const {email, password } = req.body;
    const key = `login:${req.ip}`;

    const user = await User.findOne({ email });
    if (!user) {
      await redisClient.incr(key);
      await redisClient.expire(key, 15 * 60);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await redisClient.incr(key);
      await redisClient.expire(key, 15 * 60);
      return res.status(400).json({ message: "Invalid email or password" });
    }

   
    await redisClient.del(key);

    const token = generateToken(res, user);
    return res.status(200).json({ user, token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
