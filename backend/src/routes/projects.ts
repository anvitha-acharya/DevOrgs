import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware'; // Assuming your auth middleware is here

const router = express.Router();

router.route('/').post(protect, createProject).get(protect, getAllProjects);
router.route('/:id').get(protect, getProjectById); // Add update and delete later

export default router;