import pytest
import os
import subprocess
import sys

class TestFileManagementAPI:
    """Simple tests for file management API endpoints - check if endpoints exist in server code"""
    
    def test_upload_file_endpoint_exists(self):
        """Test POST /api/files/upload endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.post('/api/files/upload'," in content, "POST /api/files/upload endpoint not found"

    def test_get_files_endpoint_exists(self):
        """Test GET /api/files endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/files'," in content, "GET /api/files endpoint not found"

    def test_get_file_metadata_endpoint_exists(self):
        """Test GET /api/files/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/files/:id'," in content, "GET /api/files/:id endpoint not found"

    def test_download_file_endpoint_exists(self):
        """Test GET /api/files/:id/download endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/files/:id/download'," in content, "GET /api/files/:id/download endpoint not found"

    def test_delete_file_endpoint_exists(self):
        """Test DELETE /api/files/:id endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.delete('/api/files/:id'," in content, "DELETE /api/files/:id endpoint not found"

    def test_rename_file_endpoint_exists(self):
        """Test PUT /api/files/:id/rename endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.put('/api/files/:id/rename'," in content, "PUT /api/files/:id/rename endpoint not found"
