// Test setup file for Jest
const mongoose = require('mongoose');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_here';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nodenest_test';

// Increase timeout for database operations
jest.setTimeout(10000);

// Global MongoDB connection setup
beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Global cleanup
afterAll(async () => {
  // Close MongoDB connection
  await mongoose.connection.close();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Mock console methods in tests to reduce noise
const originalConsole = global.console;
beforeAll(() => {
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

afterAll(() => {
  global.console = originalConsole;
});
