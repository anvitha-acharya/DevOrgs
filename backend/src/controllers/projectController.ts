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
    res.status(500).json({ message: error.message });
  }
};

// Get all projects for the authenticated user
export const getProjects = async (req: Request, res: Response) => {
  try {
    const owner = (req as any).user.id; // Assuming user ID is attached to the request after authentication
    
    const projects = await Project.find({ owner }).populate('tasks'); // Populate tasks if needed

    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};