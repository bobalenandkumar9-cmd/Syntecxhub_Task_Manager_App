const Task = require('../models/Task');

// Only these fields may be set by the client (prevents mass-assignment of "user", etc.)
const ALLOWED_FIELDS = ['title', 'description', 'status', 'priority', 'dueDate'];

const pickAllowed = (body) =>
  ALLOWED_FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

// @desc    Get all tasks of the logged-in user (supports ?status=&priority=&search=)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    if (typeof req.query.status === 'string' && req.query.status) {
      filter.status = req.query.status;
    }
    if (typeof req.query.priority === 'string' && req.query.priority) {
      filter.priority = req.query.priority;
    }
    if (typeof req.query.search === 'string' && req.query.search.trim()) {
      const escaped = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.title = { $regex: escaped, $options: 'i' };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const data = pickAllowed(req.body);
    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({ ...data, user: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const data = pickAllowed(req.body);

    if (data.title !== undefined && (typeof data.title !== 'string' || !data.title.trim())) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      data,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted', id: task._id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
