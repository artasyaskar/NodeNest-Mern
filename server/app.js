const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Simple auth routes
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  
  // Simple validation
  if (!username || !email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Mock successful registration
  res.status(201).json({
    token: 'mock_jwt_token',
    user: {
      id: '1',
      username,
      email,
      firstName,
      lastName
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }
  
  // Mock successful login
  res.json({
    token: 'mock_jwt_token',
    user: {
      id: '1',
      username: 'testuser',
      email,
      firstName: 'Test',
      lastName: 'User'
    }
  });
});

// Project management endpoints
app.post('/api/projects', (req, res) => {
  const { name, description, status } = req.body;

  // Simple validation
  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  // Mock successful project creation
  res.status(201).json({
    project: {
      id: '1',
      name,
      description: description || '',
      status: status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });
});

app.get('/api/projects', (req, res) => {
  // Mock projects list
  res.json([
    {
      id: '1',
      name: 'Sample Project',
      description: 'A sample project for testing',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

app.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;

  // Mock project by ID
  res.json({
    project: {
      id,
      name: 'Sample Project',
      description: 'A sample project for testing',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });
});

app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  // Mock project update
  res.json({
    project: {
      id,
      name: name || 'Sample Project',
      description: description || 'A sample project for testing',
      status: status || 'active',
      updatedAt: new Date().toISOString()
    }
  });
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;

  // Mock project deletion
  res.json({ message: 'Project deleted successfully', projectId: id });
});

app.post('/api/projects/:id/tasks', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  // Simple validation
  if (!title) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  // Mock task addition to project
  res.status(201).json({
    task: {
      id: '1',
      projectId: id,
      title,
      description: description || '',
      status: status || 'todo',
      createdAt: new Date().toISOString()
    }
  });
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
