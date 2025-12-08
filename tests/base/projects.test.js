const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server/index');
const User = require('../../server/models/User');
const Project = require('../../server/models/Project');

describe('Projects Base Tests', () => {
  let token;
  let user;

  beforeEach(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});

    user = new User({
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

    token = loginResponse.body.token;
  });

  it('should create a new project successfully', async () => {
    const projectData = {
      name: 'Test Project',
      description: 'This is a test project',
      priority: 'medium'
    };

    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send(projectData)
      .expect(201);

    expect(response.body.project.name).toBe(projectData.name);
    expect(response.body.project.description).toBe(projectData.description);
    expect(response.body.project.owner).toBe(user._id.toString());
  });

  it('should get all projects for user', async () => {
    const project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      owner: user._id,
      members: [{ user: user._id, role: 'project_manager' }]
    });
    await project.save();

    const response = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.projects).toHaveLength(1);
    expect(response.body.projects[0].name).toBe('Test Project');
  });

  it('should get project by ID', async () => {
    const project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      owner: user._id,
      members: [{ user: user._id, role: 'project_manager' }]
    });
    await project.save();

    const response = await request(app)
      .get(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.project.name).toBe('Test Project');
    expect(response.body.tasks).toBeDefined();
  });
});
