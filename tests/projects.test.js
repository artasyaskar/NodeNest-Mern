const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/index');
const User = require('../server/models/User');
const Project = require('../server/models/Project');

describe('Projects Endpoints', () => {
  let token;
  let user;

  beforeAll(async () => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nodenest_test';
    await mongoose.connect(mongoURI);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});

    // Create and login a test user
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

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/projects', () => {
    it('should create a new project successfully', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'This is a test project',
        priority: 'medium',
        tags: ['test', 'project'],
        technologies: ['React', 'Node.js']
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send(projectData)
        .expect(201);

      expect(response.body.project.name).toBe(projectData.name);
      expect(response.body.project.description).toBe(projectData.description);
      expect(response.body.project.owner).toBe(user._id.toString());
      expect(response.body.project.members).toHaveLength(1);
      expect(response.body.project.members[0].role).toBe('project_manager');
    });

    it('should return error for missing required fields', async () => {
      const projectData = {
        description: 'This is a test project'
        // Missing name
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send(projectData)
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });

    it('should return error without authentication', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'This is a test project'
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(401);

      expect(response.body.message).toBe('No token, authorization denied');
    });
  });

  describe('GET /api/projects', () => {
    beforeEach(async () => {
      // Create test projects
      const project1 = new Project({
        name: 'Project 1',
        description: 'First test project',
        owner: user._id,
        members: [{ user: user._id, role: 'project_manager' }]
      });
      await project1.save();

      const project2 = new Project({
        name: 'Project 2',
        description: 'Second test project',
        owner: user._id,
        members: [{ user: user._id, role: 'developer' }]
      });
      await project2.save();
    });

    it('should get all projects for user', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.projects).toHaveLength(2);
      expect(response.body.projects[0].name).toBe('Project 2'); // Sorted by createdAt desc
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(401);

      expect(response.body.message).toBe('No token, authorization denied');
    });
  });

  describe('GET /api/projects/:id', () => {
    let project;

    beforeEach(async () => {
      project = new Project({
        name: 'Test Project',
        description: 'This is a test project',
        owner: user._id,
        members: [{ user: user._id, role: 'project_manager' }]
      });
      await project.save();
    });

    it('should get project by ID', async () => {
      const response = await request(app)
        .get(`/api/projects/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.project.name).toBe('Test Project');
      expect(response.body.project.description).toBe('This is a test project');
      expect(response.body.tasks).toBeDefined();
    });

    it('should return error for non-existent project', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/projects/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.message).toBe('Project not found');
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get(`/api/projects/${project._id}`)
        .expect(401);

      expect(response.body.message).toBe('No token, authorization denied');
    });
  });

  describe('PUT /api/projects/:id', () => {
    let project;

    beforeEach(async () => {
      project = new Project({
        name: 'Test Project',
        description: 'This is a test project',
        owner: user._id,
        members: [{ user: user._id, role: 'project_manager' }]
      });
      await project.save();
    });

    it('should update project successfully', async () => {
      const updateData = {
        name: 'Updated Project',
        description: 'Updated description',
        status: 'in_progress'
      };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.project.name).toBe(updateData.name);
      expect(response.body.project.description).toBe(updateData.description);
      expect(response.body.project.status).toBe(updateData.status);
    });

    it('should return error for non-existent project', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = { name: 'Updated Project' };

      const response = await request(app)
        .put(`/api/projects/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('Project not found');
    });

    it('should return error without authentication', async () => {
      const updateData = { name: 'Updated Project' };

      const response = await request(app)
        .put(`/api/projects/${project._id}`)
        .send(updateData)
        .expect(401);

      expect(response.body.message).toBe('No token, authorization denied');
    });
  });
});
