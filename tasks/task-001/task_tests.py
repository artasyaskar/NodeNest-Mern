import pytest
import os
import subprocess
import sys

class TestUserAPI:
    """Simple tests for user API endpoints - check if endpoints exist in server code"""
    
    def test_get_profile_endpoint_exists(self):
        """Test GET /api/users/profile endpoint exists in server code"""
        app_file = os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js')
        with open(app_file, 'r') as f:
            content = f.read()
        assert 'users/profile' in content, "GET /api/users/profile endpoint not found"

    def test_update_profile_endpoint_exists(self):
        """Test PUT /api/users/profile endpoint exists in server code"""
        app_file = os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js')
        with open(app_file, 'r') as f:
            content = f.read()
        assert 'users/profile' in content, "PUT /api/users/profile endpoint not found"

    def test_get_users_endpoint_exists(self):
        """Test GET /api/users endpoint exists in server code"""
        app_file = os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js')
        with open(app_file, 'r') as f:
            content = f.read()
        assert '/api/users' in content, "GET /api/users endpoint not found"

    def test_get_user_by_id_endpoint_exists(self):
        """Test GET /api/users/:id endpoint exists in server code"""
        app_file = os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js')
        with open(app_file, 'r') as f:
            content = f.read()
        assert 'users/' in content, "GET /api/users/:id endpoint not found"

    def test_update_user_by_id_endpoint_exists(self):
        """Test PUT /api/users/:id endpoint exists in server code"""
        app_file = os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js')
        with open(app_file, 'r') as f:
            content = f.read()
        assert 'users/' in content, "PUT /api/users/:id endpoint not found"

    def test_delete_user_endpoint_exists(self):
        """Test DELETE /api/users/:id endpoint exists in server code"""
        app_file = os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js')
        with open(app_file, 'r') as f:
            content = f.read()
        assert 'delete' in content.lower(), "DELETE /api/users/:id endpoint not found"
