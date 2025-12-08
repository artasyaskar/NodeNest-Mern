const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects for a user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ],
      isActive: true
    })
    .populate('owner', 'username firstName lastName')
    .populate('members.user', 'username firstName lastName')
    .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, priority, tags, technologies } = req.body;

    const project = new Project({
      name,
      description,
      owner: req.user.id,
      priority,
      tags,
      technologies,
      members: [{ user: req.user.id, role: 'project_manager' }]
    });

    await project.save();
    await project.populate('owner', 'username firstName lastName');
    await project.populate('members.user', 'username firstName lastName');

    res.status(201).json({ project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'username firstName lastName')
      .populate('members.user', 'username firstName lastName');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or member
    const isMember = project.owner._id.toString() === req.user.id ||
                    project.members.some(member => member.user._id.toString() === req.user.id);

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    // Get project tasks
    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ project, tasks });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or project manager
    const isOwner = project.owner.toString() === req.user.id;
    const isProjectManager = project.members.some(
      member => member.user.toString() === req.user.id && member.role === 'project_manager'
    );

    if (!isOwner && !isProjectManager) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('owner', 'username firstName lastName')
    .populate('members.user', 'username firstName lastName');

    res.json({ project: updatedProject });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
