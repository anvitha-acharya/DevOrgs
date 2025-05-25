const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'guide'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  invitedEmails: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Project Routes
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user.userId },
        { members: req.user.userId }
      ]
    }).populate('createdBy', 'name email');

    // Get tasks for each project
    const projectsWithTasks = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ projectId: project._id })
          .populate('createdBy', 'name email')
          .populate('assignedTo', 'name email');
        
        return {
          id: project._id,
          title: project.title,
          description: project.description,
          startDate: project.startDate,
          endDate: project.endDate,
          createdBy: project.createdBy._id,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          members: project.members,
          invitedEmails: project.invitedEmails,
          tasks: tasks.map(task => ({
            id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            createdBy: task.createdBy._id,
            assignedTo: task.assignedTo?._id,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
          }))
        };
      })
    );

    res.json(projectsWithTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { title, description, startDate, endDate, invitedEmails } = req.body;

    const project = new Project({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdBy: req.user.userId,
      members: [req.user.userId],
      invitedEmails: invitedEmails || []
    });

    await project.save();
    await project.populate('createdBy', 'name email');

    res.status(201).json({
      id: project._id,
      title: project.title,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      createdBy: project.createdBy._id,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      members: project.members,
      invitedEmails: project.invitedEmails,
      tasks: []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Task Routes
app.post('/api/projects/:projectId/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const { projectId } = req.params;

    // Check if project exists and user has access
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { createdBy: req.user.userId },
        { members: req.user.userId }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found or access denied' });
    }

    const task = new Task({
      title,
      description,
      projectId,
      createdBy: req.user.userId,
      status: 'todo'
    });

    await task.save();
    await task.populate('createdBy', 'name email');

    res.status(201).json({
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdBy: task.createdBy._id,
      assignedTo: task.assignedTo,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:taskId/status', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findById(taskId).populate({
      path: 'projectId',
      select: 'createdBy members'
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user has access to the project
    const hasAccess = task.projectId.createdBy.equals(req.user.userId) || 
                     task.projectId.members.includes(req.user.userId);

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    task.status = status;
    task.updatedAt = new Date();
    await task.save();

    res.json({
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdBy: task.createdBy,
      assignedTo: task.assignedTo,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});