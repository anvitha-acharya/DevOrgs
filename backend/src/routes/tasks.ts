import express from 'express';
import {
  createTask,
  getTasksForProject,
  updateTask,
  deleteTask,
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware'; // Assuming you have an auth middleware

const router = express.Router();

// Protect all task routes with authentication
router.use(protect);

// Create a new task for a project
router.post('/projects/:projectId/tasks', createTask);

// Get all tasks for a project
router.get('/projects/:projectId/tasks', getTasksForProject);

// Update a task by ID
router.put('/tasks/:id', updateTask);

// Delete a task by ID
router.delete('/tasks/:id', deleteTask);

export default router;