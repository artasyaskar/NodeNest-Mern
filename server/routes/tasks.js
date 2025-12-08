const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks for a user
router.get('/', auth, async (req, res) => {
  try {
    const { status, project, priority } = req.query;
    let query = {
      $or: [
        { assignedTo: req.user.id },
        { createdBy: req.user.id }
      ],
      isActive: true
    };

    if (status) query.status = status;
    if (project) query.project = project;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, type, estimatedHours, dueDate, tags } = req.body;

    // Check if user is member of the project
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = projectDoc.owner.toString() === req.user.id ||
                    projectDoc.members.some(member => member.user.toString() === req.user.id);

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
    }

    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      createdBy: req.user.id,
      priority,
      type,
      estimatedHours,
      dueDate,
      tags
    });

    await task.save();
    await task.populate([
      { path: 'project', select: 'name' },
      { path: 'assignedTo', select: 'username firstName lastName' },
      { path: 'createdBy', select: 'username firstName lastName' }
    ]);

    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'username firstName lastName')
      .populate('createdBy', 'username firstName lastName')
      .populate('comments.user', 'username firstName lastName')
      .populate('dependencies', 'title status');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned to, created, or is project member
    const hasAccess = task.assignedTo?._id?.toString() === req.user.id ||
                     task.createdBy._id.toString() === req.user.id;

    if (!hasAccess) {
      // Check project membership
      const project = await Project.findById(task.project._id);
      const isProjectMember = project.owner.toString() === req.user.id ||
                             project.members.some(member => member.user.toString() === req.user.id);

      if (!isProjectMember) {
        return res.status(403).json({ message: 'Not authorized to view this task' });
      }
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned to, created, or is project manager
    const hasAccess = task.assignedTo?.toString() === req.user.id ||
                     task.createdBy.toString() === req.user.id;

    if (!hasAccess) {
      // Check project management role
      const project = await Project.findById(task.project);
      const isProjectManager = project.owner.toString() === req.user.id ||
                              project.members.some(
                                member => member.user.toString() === req.user.id && member.role === 'project_manager'
                              );

      if (!isProjectManager) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('project', 'name')
    .populate('assignedTo', 'username firstName lastName')
    .populate('createdBy', 'username firstName lastName');

    res.json({ task: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks/:id/comments
// @desc    Add comment to task
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check access (similar to update)
    const hasAccess = task.assignedTo?.toString() === req.user.id ||
                     task.createdBy.toString() === req.user.id;

    if (!hasAccess) {
      const project = await Project.findById(task.project);
      const isProjectMember = project.owner.toString() === req.user.id ||
                             project.members.some(member => member.user.toString() === req.user.id);

      if (!isProjectMember) {
        return res.status(403).json({ message: 'Not authorized to comment on this task' });
      }
    }

    task.comments.push({
      user: req.user.id,
      content,
      createdAt: new Date()
    });

    await task.save();
    await task.populate('comments.user', 'username firstName lastName');

    res.json({ task });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
