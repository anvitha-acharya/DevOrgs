import { Request, Response } from 'express';
import Project from '../models/Project';
import User from '../models/User'; // Assuming you have a User model

// Create a new project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, endDate, collaboratorEmail } = req.body;
    const owner = (req as any).user.id; // Assuming user ID is attached to the request after authentication

    const newProject = new Project({
      name,
      description,
      startDate,
      endDate,
      collaboratorEmail,
      owner,
    });

    const project = await newProject.save();
    res.status(201).json(project);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get all projects for the authenticated user
export const getProjects = async (req: Request, res: Response) => {
  try {
    const owner = (req as any).user.id; // Assuming user ID is attached to the request after authentication
    
    const projects = await Project.find({ owner }).populate('tasks'); // Populate tasks if needed

    res.status(200).json(projects);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get a specific project by ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id).populate('tasks'); // Populate tasks if needed

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    // Optional: Check if the authenticated user is the owner or a collaborator
    if (project.owner.toString() !== (req as any).user.id && project.collaboratorEmail !== (req as any).user.email) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    res.status(200).json(project);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Update a project by ID
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, endDate, collaboratorEmail } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check if the authenticated user is the owner
    if (project.owner.toString() !== (req as any).user.id) {
      res.status(403);
      throw new Error('Not authorized to update this project');
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.startDate = startDate || project.startDate;
    project.endDate = endDate || project.endDate;
    project.collaboratorEmail = collaboratorEmail || project.collaboratorEmail;

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Delete a project by ID
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Optional: Check if the authenticated user is the owner before deleting
    if (project.owner.toString() !== (req as any).user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this project');
    }

    await project.deleteOne(); // Use deleteOne() for Mongoose v5+
    res.status(200).json({ message: 'Project removed' });
  } catch (error: any) {
    throw new Error(error.message);
  }
};