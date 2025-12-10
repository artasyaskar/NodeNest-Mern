import pytest
import os
import subprocess
import sys

class TestActivityLogAPI:
    """Simple tests for activity log and audit trail API endpoints - check if endpoints exist in server code"""
    
    def test_get_activities_endpoint_exists(self):
        """Test GET /api/activities endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/activities'," in content, "GET /api/activities endpoint not found"

    def test_log_activity_endpoint_exists(self):
        """Test POST /api/activities endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.post('/api/activities'," in content, "POST /api/activities endpoint not found"

    def test_get_user_activities_endpoint_exists(self):
        """Test GET /api/activities/user/:userId endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/activities/user/:userId'," in content, "GET /api/activities/user/:userId endpoint not found"

    def test_get_resource_activities_endpoint_exists(self):
        """Test GET /api/activities/resource/:resourceType/:resourceId endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/activities/resource/:resourceType/:resourceId'," in content, "GET /api/activities/resource/:resourceType/:resourceId endpoint not found"

    def test_export_activities_endpoint_exists(self):
        """Test GET /api/activities/export endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/activities/export'," in content, "GET /api/activities/export endpoint not found"

    def test_cleanup_activities_endpoint_exists(self):
        """Test DELETE /api/activities/cleanup endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.delete('/api/activities/cleanup'," in content, "DELETE /api/activities/cleanup endpoint not found"
