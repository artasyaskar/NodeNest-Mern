import pytest
import requests
import time

BASE_URL = "http://localhost:5000"

class TestUserProfileManagement:
    
    @pytest.fixture(scope="class", autouse=True)
    def setup_class(self):
        """Wait for server to be ready and create test user"""
        max_retries = 30
        for i in range(max_retries):
            try:
                response = requests.get(f"{BASE_URL}/api/health", timeout=2)
                if response.status_code == 200:
                    break
            except requests.exceptions.RequestException:
                pass
            time.sleep(0.2)
        else:
            pytest.fail("Server failed to start within timeout")

        # Create and login test user
        register_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123",
            "firstName": "Test",
            "lastName": "User"
        }
        requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
        
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test@example.com",
            "password": "password123"
        })
        
        TestUserProfileManagement.auth_token = login_response.json()["token"]
        TestUserProfileManagement.user_id = login_response.json()["user"]["id"]

    def test_update_profile_valid_data(self):
        """Test profile update with valid data"""
        headers = {"Authorization": f"Bearer {TestUserProfileManagement.auth_token}"}
        profile_data = {
            "firstName": "Updated",
            "lastName": "Name",
            "bio": "This is my updated bio",
            "skills": ["JavaScript", "React", "Node.js"]
        }
        
        response = requests.put(
            f"{BASE_URL}/api/users/{TestUserProfileManagement.user_id}/profile",
            json=profile_data,
            headers=headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert data["user"]["firstName"] == "Updated"
        assert data["user"]["lastName"] == "Name"
        assert data["user"]["bio"] == "This is my updated bio"
        assert "JavaScript" in data["user"]["skills"]

    def test_update_profile_invalid_data(self):
        """Test profile update with invalid data"""
        headers = {"Authorization": f"Bearer {TestUserProfileManagement.auth_token}"}
        invalid_data = {
            "firstName": "",  # Empty first name
            "skills": "not an array"  # Invalid skills type
        }
        
        response = requests.put(
            f"{BASE_URL}/api/users/{TestUserProfileManagement.user_id}/profile",
            json=invalid_data,
            headers=headers
        )
        
        assert response.status_code == 400
        data = response.json()
        assert "message" in data or "error" in data

    def test_get_profile_complete(self):
        """Test getting complete user profile"""
        headers = {"Authorization": f"Bearer {TestUserProfileManagement.auth_token}"}
        
        response = requests.get(
            f"{BASE_URL}/api/users/{TestUserProfileManagement.user_id}/profile",
            headers=headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        user = data["user"]
        assert "firstName" in user
        assert "lastName" in user
        assert "email" in user
        assert "skills" in user
        assert isinstance(user["skills"], list)

    def test_update_skills_array(self):
        """Test updating user skills array"""
        headers = {"Authorization": f"Bearer {TestUserProfileManagement.auth_token}"}
        skills_data = {
            "skills": ["Python", "Django", "PostgreSQL", "React"]
        }
        
        response = requests.put(
            f"{BASE_URL}/api/users/{TestUserProfileManagement.user_id}/skills",
            json=skills_data,
            headers=headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        user_skills = data["user"]["skills"]
        assert "Python" in user_skills
        assert "Django" in user_skills
        assert len(user_skills) == 4

    def test_search_users_by_skill(self):
        """Test searching users by skill"""
        # First update a user with specific skills
        headers = {"Authorization": f"Bearer {TestUserProfileManagement.auth_token}"}
        skills_data = {"skills": ["JavaScript", "React", "MongoDB"]}
        requests.put(
            f"{BASE_URL}/api/users/{TestUserProfileManagement.user_id}/skills",
            json=skills_data,
            headers=headers
        )
        
        # Search for users with JavaScript skill
        response = requests.get(f"{BASE_URL}/api/users/search?skill=JavaScript")
        
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
        users = data["users"]
        assert len(users) >= 1
        # Check if at least one user has JavaScript skill
        found = any("JavaScript" in user.get("skills", []) for user in users)
        assert found

    def test_search_users_no_results(self):
        """Test searching users with skill that returns no results"""
        response = requests.get(f"{BASE_URL}/api/users/search?skill=nonexistent_skill")
        
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
        users = data["users"]
        assert isinstance(users, list)
        assert len(users) == 0
