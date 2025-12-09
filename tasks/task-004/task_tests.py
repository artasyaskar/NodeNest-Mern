import pytest
import os
import subprocess
import sys

class TestDashboardAPI:
    """Simple tests for dashboard analytics API endpoints - check if endpoints exist in server code"""
    
    def test_dashboard_stats_endpoint_exists(self):
        """Test GET /api/dashboard/stats endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/dashboard/stats'," in content, "GET /api/dashboard/stats endpoint not found"

    def test_projects_summary_endpoint_exists(self):
        """Test GET /api/dashboard/projects/summary endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/dashboard/projects/summary'," in content, "GET /api/dashboard/projects/summary endpoint not found"

    def test_tasks_status_endpoint_exists(self):
        """Test GET /api/dashboard/tasks/status endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/dashboard/tasks/status'," in content, "GET /api/dashboard/tasks/status endpoint not found"

    def test_users_activity_endpoint_exists(self):
        """Test GET /api/dashboard/users/activity endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/dashboard/users/activity'," in content, "GET /api/dashboard/users/activity endpoint not found"

    def test_recent_activities_endpoint_exists(self):
        """Test GET /api/dashboard/recent/activities endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/dashboard/recent/activities'," in content, "GET /api/dashboard/recent/activities endpoint not found"

    def test_performance_metrics_endpoint_exists(self):
        """Test GET /api/dashboard/performance/metrics endpoint exists in server code"""
        app_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server', 'app.js'))
        with open(app_file, 'r') as f:
            content = f.read()
        assert "app.get('/api/dashboard/performance/metrics'," in content, "GET /api/dashboard/performance/metrics endpoint not found"
