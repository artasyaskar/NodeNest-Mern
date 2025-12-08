const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server/index');
const User = require('../../server/models/User');

describe('Authentication Base Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.username).toBe(userData.username);
  });

  it('should login user successfully', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
    await user.save();

    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(loginData.email);
  });

  it('should get current user profile', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
    await user.save();

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.user.email).toBe('test@example.com');
  });
});
