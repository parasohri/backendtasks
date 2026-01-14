import express from 'express';
import * as teamController from '../controllers/Team.controller.js';

const router = express.Router();
import { verifyToken } from '../middleware/auth.js';
router.post('/',verifyToken,teamController.createTeam);
router.post('/:teamId/add-member',verifyToken,teamController.addMember);
router.delete('/:teamId/remove-member/:useid',verifyToken,teamController.removeMember);
router.get('/:teamId/members',verifyToken,teamController.getTeamMembers);
export default router;