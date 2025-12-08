const request = require('supertest');
const app = require('../server/app');

describe('Simple API Tests', () => {
  test('App should be defined', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
  });

  test('GET /api/health should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
  });

  test('POST /api/auth/register should work', async () => {
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
  });
});
