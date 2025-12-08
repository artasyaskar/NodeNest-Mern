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

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
