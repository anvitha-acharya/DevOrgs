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
// router.use(protect); // Removing this as protect will be applied to specific routes

// Create a new task for a project
router.post('/projects/:projectId/tasks', createTask);

// Get all tasks for a project
router.get('/projects/:projectId/tasks', getTasksForProject);

// Update a task by ID
router.put('/tasks/:id', updateTask);

// Delete a task by ID
router.delete('/tasks/:id', deleteTask);


// Apply protect middleware to each route individually for clarity and control
router.post('/projects/:projectId/tasks', protect, createTask);
router.get('/projects/:projectId/tasks', protect, getTasksForProject);
router.put('/tasks/:id', protect, updateTask);
router.delete('/tasks/:id', protect, deleteTask);

// NOTE: If you intend to have some task routes unprotected,
// you should not use router.use(protect) at the top.

export default router;