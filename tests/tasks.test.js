const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/index');
const User = require('../server/models/User');
const Project = require('../server/models/Project');
const Task = require('../server/models/Task');

describe('Tasks Endpoints', () => {
  let token;
  let user;
  let project;

  beforeEach(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

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

    // Create a test project
    project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      owner: user._id,
      members: [{ user: user._id, role: 'project_manager' }]
    });
    await project.save();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        project: project._id,
        priority: 'medium',
        type: 'feature',
        estimatedHours: 8
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)
        .expect(201);

      expect(response.body.task.title).toBe(taskData.title);
      expect(response.body.task.description).toBe(taskData.description);
      expect(response.body.task.project).toBe(project._id.toString());
      expect(response.body.task.createdBy).toBe(user._id.toString());
      expect(response.body.task.priority).toBe(taskData.priority);
      expect(response.body.task.type).toBe(taskData.type);
    });

    it('should create task with assignee', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        project: project._id,
        assignedTo: user._id,
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)
        .expect(201);

      expect(response.body.task.assignedTo).toBe(user._id.toString());
    });

    it('should return error for missing required fields', async () => {
      const taskData = {
        description: 'This is a test task'
        // Missing title and project
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });

    it('should return error for non-existent project', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        project: fakeId
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)
        .expect(404);

      expect(response.body.message).toBe('Project not found');
    });

    it('should return error without authentication', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        project: project._id
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(401);

      expect(response.body.message).toBe('No token, authorization denied');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create test tasks
      const task1 = new Task({
        title: 'Task 1',
        description: 'First test task',
        project: project._id,
        createdBy: user._id,
        status: 'todo'
      });
      await task1.save();

      const task2 = new Task({
        title: 'Task 2',
        description: 'Second test task',
        project: project._id,
        createdBy: user._id,
        assignedTo: user._id,
        status: 'in_progress'
      });
      await task2.save();
    });

    it('should get all tasks for user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.tasks).toHaveLength(2);
      expect(response.body.tasks[0].title).toBe('Task 2'); // Sorted by createdAt desc
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=todo')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.tasks).toHaveLength(1);
      expect(response.body.tasks[0].status).toBe('todo');
    });

    it('should filter tasks by project', async () => {
      const response = await request(app)
        .get(`/api/tasks?project=${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.tasks).toHaveLength(2);
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(401);

      expect(response.body.message).toBe('No token, authorization denied');
    });
  });

  describe('GET /api/tasks/:id', () => {
    let task;

    beforeEach(async () => {
      task = new Task({
        title: 'Test Task',
        description: 'This is a test task',
        project: project._id,
        createdBy: user._id,
        assignedTo: user._id
      });
      await task.save();
    });

    it('should get task by ID', async () => {
      const response = await request(app)
        .get(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.task.title).toBe('Test Task');
      expect(response.body.task.description).toBe('This is a test task');
      expect(response.body.task.project.name).toBe('Test Project');
    });

    it('should return error for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.message).toBe('Task not found');
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get(`/api/tasks/${task._id}`)
        .expect(401);

      expect(response.body.message).toBe('No token, authorization denied');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let task;

    beforeEach(async () => {
      task = new Task({
        title: 'Test Task',
        description: 'This is a test task',
        project: project._id,
        createdBy: user._id,
        status: 'todo'
      });
      await task.save();
    });

    it('should update task successfully', async () => {
      const updateData = {
        title: 'Updated Task',
        status: 'in_progress',
        actualHours: 5
      };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.task.title).toBe(updateData.title);
      expect(response.body.task.status).toBe(updateData.status);
      expect(response.body.task.actualHours).toBe(updateData.actualHours);
    });

    it('should return error for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = { title: 'Updated Task' };

      const response = await request(app)
        .put(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('Task not found');
    });

    it('should return error without authentication', async () => {
      const updateData = { title: 'Updated Task' };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send(updateData)
        .expect(401);

      expect(response.body.message).toBe('No token, authorization denied');
    });
  });

  describe('POST /api/tasks/:id/comments', () => {
    let task;

    beforeEach(async () => {
      task = new Task({
        title: 'Test Task',
        description: 'This is a test task',
        project: project._id,
        createdBy: user._id,
        comments: []
      });
      await task.save();
    });

    it('should add comment to task successfully', async () => {
      const commentData = {
        content: 'This is a test comment'
      };

      const response = await request(app)
        .post(`/api/tasks/${task._id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentData)
        .expect(200);

      expect(response.body.task.comments).toHaveLength(1);
      expect(response.body.task.comments[0].content).toBe(commentData.content);
      expect(response.body.task.comments[0].user).toBe(user._id.toString());
    });

    it('should return error for missing content', async () => {
      const response = await request(app)
        .post(`/api/tasks/${task._id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });

    it('should return error for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const commentData = { content: 'Test comment' };

      const response = await request(app)
        .post(`/api/tasks/${fakeId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentData)
        .expect(404);

      expect(response.body.message).toBe('Task not found');
    });

    it('should return error without authentication', async () => {
      const commentData = { content: 'Test comment' };

      const response = await request(app)
        .post(`/api/tasks/${task._id}/comments`)
        .send(commentData)
        .expect(401);

      expect(response.body.message).toBe('No token, authorization denied');
    });
  });
});
