import pytest
import os
import subprocess
import sys

class TestProjectAPI:
    """Simple tests for project API endpoints - check if endpoints exist in server code"""
    
    def test_create_project_endpoint_exists(self):
        """Test POST /api/projects endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.post('/api/projects'," in content, "POST /api/projects endpoint not found"

    def test_get_projects_endpoint_exists(self):
        """Test GET /api/projects endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/projects'," in content, "GET /api/projects endpoint not found"

    def test_get_project_by_id_endpoint_exists(self):
        """Test GET /api/projects/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/projects/:id'," in content, "GET /api/projects/:id endpoint not found"

    def test_update_project_endpoint_exists(self):
        """Test PUT /api/projects/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.put('/api/projects/:id'," in content, "PUT /api/projects/:id endpoint not found"

    def test_delete_project_endpoint_exists(self):
        """Test DELETE /api/projects/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.delete('/api/projects/:id'," in content, "DELETE /api/projects/:id endpoint not found"

    def test_add_task_to_project_endpoint_exists(self):
        """Test POST /api/projects/:id/tasks endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.post('/api/projects/:id/tasks'," in content, "POST /api/projects/:id/tasks endpoint not found"
