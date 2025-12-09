import pytest
import os
import subprocess
import sys

class TestTaskAPI:
    """Simple tests for task API endpoints - check if endpoints exist in server code"""
    
    def test_create_task_endpoint_exists(self):
        """Test POST /api/tasks endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.post('/api/tasks'," in content, "POST /api/tasks endpoint not found"

    def test_get_tasks_endpoint_exists(self):
        """Test GET /api/tasks endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/tasks'," in content, "GET /api/tasks endpoint not found"

    def test_get_task_by_id_endpoint_exists(self):
        """Test GET /api/tasks/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/tasks/:id'," in content, "GET /api/tasks/:id endpoint not found"

    def test_update_task_endpoint_exists(self):
        """Test PUT /api/tasks/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.put('/api/tasks/:id'," in content, "PUT /api/tasks/:id endpoint not found"

    def test_delete_task_endpoint_exists(self):
        """Test DELETE /api/tasks/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.delete('/api/tasks/:id'," in content, "DELETE /api/tasks/:id endpoint not found"

    def test_update_task_status_endpoint_exists(self):
        """Test PATCH /api/tasks/:id/status endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.patch('/api/tasks/:id/status'," in content, "PATCH /api/tasks/:id/status endpoint not found"
