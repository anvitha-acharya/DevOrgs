import { Request, Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import User from '../models/User';
import mongoose from 'mongoose';

// Create a new task for a project
export const createTask = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, description, assignedTo, status, dueDate } = req.body;
    const userId = (req as any).user._id; // Assuming user ID is attached to the request

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is the project owner or the collaborator
    const userEmail = (req as any).user.email;
    const isOwner = project.owner.toString() === userId.toString();
    const isCollaborator = project.collaboratorEmail === userEmail;

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'You do not have permission to create tasks in this project.' });
    }



    const newTask = new Task({
      name,
      description,
      project: projectId,
      assignedTo,
      status,
      dueDate,
      createdAt: new Date(),
    });
    
    const savedTask = await newTask.save();

    // Add the task to the project's tasks array
    project.tasks.push(savedTask._id as mongoose.Schema.Types.ObjectId);
    await project.save();

    res.status(201).json(savedTask);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks for a project
export const getTasksForProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = (req as any).user._id; // Assuming user ID is attached to the request

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is the project owner or the collaborator
    const userEmail = (req as any).user.email;
    const isOwner = project.owner.toString() === userId.toString();
    const isCollaborator = project.collaboratorEmail === userEmail;
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'You do not have permission to view tasks for this project.' });
    }

    const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'username email'); // Populate assignedTo with user info

    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = (req as any).user._id; // Assuming user ID is attached to the request

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(id).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = task.project as any;

    // Check if the user is the project owner, collaborator, or the assigned user
    const userEmail = (req as any).user.email;
    const isOwner = project.owner.toString() === userId.toString();
    const isCollaborator = project.collaboratorEmail === userEmail;
    const isAssignedTo = task.assignedTo && task.assignedTo.toString() === userId.toString();


    if (!isOwner && !isCollaborator && !isAssignedTo) {
       return res.status(403).json({ message: 'You do not have permission to update this task' });
    }


    // Prevent changing the project the task belongs to through this endpoint
    if (updates.project) {
        delete updates.project;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id; // Assuming user ID is attached to the request


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(id).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = task.project as any;

    // Check if the user is the project owner or the collaborator
    const userEmail = (req as any).user.email;
    const isOwner = project.owner.toString() === userId.toString();
    const isCollaborator = project.collaboratorEmail === userEmail;
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'You do not have permission to delete this task.' });
    }


    await Task.findByIdAndDelete(id);

    // Remove the task from the project's tasks array
    project.tasks = project.tasks.filter((taskId: mongoose.Types.ObjectId) => taskId.toString() !== id);
    await project.save();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};