const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server/index');
const User = require('../../server/models/User');
const Project = require('../../server/models/Project');
const Task = require('../../server/models/Task');

describe('Tasks Base Tests', () => {
  let token;
  let user;
  let project;

  beforeAll(async () => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nodenest_test';
    await mongoose.connect(mongoURI);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

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

    project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      owner: user._id,
      members: [{ user: user._id, role: 'project_manager' }]
    });
    await project.save();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new task successfully', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'This is a test task',
      project: project._id,
      priority: 'medium',
      type: 'feature'
    };

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(taskData)
      .expect(201);

    expect(response.body.task.title).toBe(taskData.title);
    expect(response.body.task.description).toBe(taskData.description);
    expect(response.body.task.project).toBe(project._id.toString());
  });

  it('should get all tasks for user', async () => {
    const task = new Task({
      title: 'Test Task',
      description: 'This is a test task',
      project: project._id,
      createdBy: user._id,
      status: 'todo'
    });
    await task.save();

    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.tasks).toHaveLength(1);
    expect(response.body.tasks[0].title).toBe('Test Task');
  });

  it('should get task by ID', async () => {
    const task = new Task({
      title: 'Test Task',
      description: 'This is a test task',
      project: project._id,
      createdBy: user._id,
      assignedTo: user._id
    });
    await task.save();

    const response = await request(app)
      .get(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.task.title).toBe('Test Task');
    expect(response.body.task.project.name).toBe('Test Project');
  });
});
