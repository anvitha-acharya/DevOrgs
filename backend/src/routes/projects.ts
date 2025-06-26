import express from 'express';
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createProject).get(protect, getProjects);
router.route('/:id').get(protect, getProjects).put(protect, updateProject).delete(protect, deleteProject);
// Corrected import name from getAllProjects to getProjects
export default router;