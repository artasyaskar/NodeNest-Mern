import pytest
import os
import subprocess
import sys

class TestSearchAPI:
    """Simple tests for search and filtering API endpoints - check if endpoints exist in server code"""
    
    def test_global_search_endpoint_exists(self):
        """Test GET /api/search/global endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/search/global'," in content, "GET /api/search/global endpoint not found"

    def test_search_projects_endpoint_exists(self):
        """Test GET /api/search/projects endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/search/projects'," in content, "GET /api/search/projects endpoint not found"

    def test_search_tasks_endpoint_exists(self):
        """Test GET /api/search/tasks endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/search/tasks'," in content, "GET /api/search/tasks endpoint not found"

    def test_search_users_endpoint_exists(self):
        """Test GET /api/search/users endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/search/users'," in content, "GET /api/search/users endpoint not found"

    def test_search_files_endpoint_exists(self):
        """Test GET /api/search/files endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/search/files'," in content, "GET /api/search/files endpoint not found"

    def test_search_suggestions_endpoint_exists(self):
        """Test GET /api/search/suggestions endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/search/suggestions'," in content, "GET /api/search/suggestions endpoint not found"
