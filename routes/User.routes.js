import * as userController from '../controllers/User.controller.js';
import { loginRateLimiter } from '../middleware/loginratelimiter.js';
import express from 'express';

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/signin',loginRateLimiter, userController.signInUser);

export default router;
//auth done