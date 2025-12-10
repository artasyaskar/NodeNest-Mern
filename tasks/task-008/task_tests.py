import pytest
import os
import subprocess
import sys

class TestCommentsAPI:
    """Simple tests for comments and discussion API endpoints - check if endpoints exist in server code"""
    
    def test_get_comments_endpoint_exists(self):
        """Test GET /api/comments endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/comments'," in content, "GET /api/comments endpoint not found"

    def test_create_comment_endpoint_exists(self):
        """Test POST /api/comments endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.post('/api/comments'," in content, "POST /api/comments endpoint not found"

    def test_get_comment_by_id_endpoint_exists(self):
        """Test GET /api/comments/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/comments/:id'," in content, "GET /api/comments/:id endpoint not found"

    def test_update_comment_endpoint_exists(self):
        """Test PUT /api/comments/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.put('/api/comments/:id'," in content, "PUT /api/comments/:id endpoint not found"

    def test_delete_comment_endpoint_exists(self):
        """Test DELETE /api/comments/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.delete('/api/comments/:id'," in content, "DELETE /api/comments/:id endpoint not found"

    def test_get_resource_comments_endpoint_exists(self):
        """Test GET /api/comments/resource/:resourceId endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/comments/resource/:resourceId'," in content, "GET /api/comments/resource/:resourceId endpoint not found"
