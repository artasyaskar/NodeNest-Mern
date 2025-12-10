import pytest
import os
import subprocess
import sys

class TestTagsAPI:
    """Simple tests for tags and labels API endpoints - check if endpoints exist in server code"""
    
    def test_get_tags_endpoint_exists(self):
        """Test GET /api/tags endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/tags'," in content, "GET /api/tags endpoint not found"

    def test_create_tag_endpoint_exists(self):
        """Test POST /api/tags endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.post('/api/tags'," in content, "POST /api/tags endpoint not found"

    def test_get_tag_by_id_endpoint_exists(self):
        """Test GET /api/tags/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/tags/:id'," in content, "GET /api/tags/:id endpoint not found"

    def test_update_tag_endpoint_exists(self):
        """Test PUT /api/tags/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.put('/api/tags/:id'," in content, "PUT /api/tags/:id endpoint not found"

    def test_delete_tag_endpoint_exists(self):
        """Test DELETE /api/tags/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.delete('/api/tags/:id'," in content, "DELETE /api/tags/:id endpoint not found"

    def test_get_popular_tags_endpoint_exists(self):
        """Test GET /api/tags/popular endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/tags/popular'," in content, "GET /api/tags/popular endpoint not found"
