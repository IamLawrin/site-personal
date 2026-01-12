"""
Portfolio API Backend Tests
Tests for: Auth, Projects, Albums, Media, Reviews, Contact endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://andrei-portfolio.preview.emergentagent.com').rstrip('/')
API_URL = f"{BASE_URL}/api"
ADMIN_PASSWORD = "lwr2025admin"


class TestAuth:
    """Authentication endpoint tests"""
    
    def test_admin_login_success(self):
        """Test successful admin login with correct password"""
        response = requests.post(f"{API_URL}/admin/login", json={"password": ADMIN_PASSWORD})
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "token" in data
        assert len(data["token"]) > 0
        print(f"✓ Admin login successful, token received")
    
    def test_admin_login_wrong_password(self):
        """Test admin login with wrong password"""
        response = requests.post(f"{API_URL}/admin/login", json={"password": "wrongpassword"})
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == False
        print(f"✓ Wrong password correctly rejected")
    
    def test_admin_verify_with_valid_token(self):
        """Test token verification with valid token"""
        # First login to get token
        login_response = requests.post(f"{API_URL}/admin/login", json={"password": ADMIN_PASSWORD})
        token = login_response.json()["token"]
        
        # Verify token
        response = requests.get(f"{API_URL}/admin/verify", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] == True
        print(f"✓ Token verification successful")
    
    def test_admin_verify_without_token(self):
        """Test token verification without token"""
        response = requests.get(f"{API_URL}/admin/verify")
        assert response.status_code == 401
        print(f"✓ Unauthorized access correctly rejected")


class TestProjects:
    """Projects CRUD tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{API_URL}/admin/login", json={"password": ADMIN_PASSWORD})
        return response.json()["token"]
    
    def test_get_all_projects(self):
        """Test fetching all projects"""
        response = requests.get(f"{API_URL}/projects")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} projects")
    
    def test_create_project(self, auth_token):
        """Test creating a new project"""
        project_data = {
            "title": f"TEST_Project_{uuid.uuid4().hex[:8]}",
            "description": "Test project description",
            "category": "Test Category",
            "image": "https://example.com/test.jpg",
            "technologies": ["Python", "React"],
            "featured": False
        }
        response = requests.post(
            f"{API_URL}/projects",
            json=project_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == project_data["title"]
        assert "id" in data
        print(f"✓ Project created with id: {data['id']}")
        
        # Verify project exists via GET
        get_response = requests.get(f"{API_URL}/projects/{data['id']}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["title"] == project_data["title"]
        print(f"✓ Project verified via GET")
        
        # Cleanup - delete the test project
        delete_response = requests.delete(
            f"{API_URL}/projects/{data['id']}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 200
        print(f"✓ Test project cleaned up")
    
    def test_update_project(self, auth_token):
        """Test updating a project"""
        # Create a project first
        project_data = {
            "title": f"TEST_Update_{uuid.uuid4().hex[:8]}",
            "description": "Original description",
            "category": "Test",
            "image": "",
            "technologies": [],
            "featured": False
        }
        create_response = requests.post(
            f"{API_URL}/projects",
            json=project_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        project_id = create_response.json()["id"]
        
        # Update the project
        updated_data = {
            "title": project_data["title"],
            "description": "Updated description",
            "category": "Updated Category",
            "image": "",
            "technologies": ["Updated Tech"],
            "featured": True
        }
        update_response = requests.put(
            f"{API_URL}/projects/{project_id}",
            json=updated_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        
        # Verify update via GET
        get_response = requests.get(f"{API_URL}/projects/{project_id}")
        fetched = get_response.json()
        assert fetched["description"] == "Updated description"
        assert fetched["category"] == "Updated Category"
        print(f"✓ Project updated and verified")
        
        # Cleanup
        requests.delete(f"{API_URL}/projects/{project_id}", headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_delete_project(self, auth_token):
        """Test deleting a project"""
        # Create a project first
        project_data = {
            "title": f"TEST_Delete_{uuid.uuid4().hex[:8]}",
            "description": "To be deleted",
            "category": "Test",
            "image": "",
            "technologies": [],
            "featured": False
        }
        create_response = requests.post(
            f"{API_URL}/projects",
            json=project_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        project_id = create_response.json()["id"]
        
        # Delete the project
        delete_response = requests.delete(
            f"{API_URL}/projects/{project_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 200
        
        # Verify deletion
        get_response = requests.get(f"{API_URL}/projects/{project_id}")
        assert get_response.status_code == 404
        print(f"✓ Project deleted and verified")


class TestAlbums:
    """Albums CRUD tests"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{API_URL}/admin/login", json={"password": ADMIN_PASSWORD})
        return response.json()["token"]
    
    def test_get_all_albums(self):
        """Test fetching all albums"""
        response = requests.get(f"{API_URL}/albums")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} albums")
    
    def test_create_album(self, auth_token):
        """Test creating a new album"""
        album_data = {
            "name": f"TEST_Album_{uuid.uuid4().hex[:8]}",
            "description": "Test album description",
            "cover": "https://example.com/cover.jpg"
        }
        response = requests.post(
            f"{API_URL}/albums",
            json=album_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == album_data["name"]
        assert "id" in data
        print(f"✓ Album created with id: {data['id']}")
        
        # Cleanup
        requests.delete(f"{API_URL}/albums/{data['id']}", headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_delete_album(self, auth_token):
        """Test deleting an album"""
        # Create album first
        album_data = {
            "name": f"TEST_Delete_Album_{uuid.uuid4().hex[:8]}",
            "description": "To be deleted",
            "cover": ""
        }
        create_response = requests.post(
            f"{API_URL}/albums",
            json=album_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        album_id = create_response.json()["id"]
        
        # Delete
        delete_response = requests.delete(
            f"{API_URL}/albums/{album_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 200
        print(f"✓ Album deleted successfully")


class TestMedia:
    """Media/Images tests"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{API_URL}/admin/login", json={"password": ADMIN_PASSWORD})
        return response.json()["token"]
    
    @pytest.fixture
    def test_album(self, auth_token):
        """Create a test album for media tests"""
        album_data = {
            "name": f"TEST_Media_Album_{uuid.uuid4().hex[:8]}",
            "description": "Album for media tests",
            "cover": ""
        }
        response = requests.post(
            f"{API_URL}/albums",
            json=album_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        album = response.json()
        yield album
        # Cleanup
        requests.delete(f"{API_URL}/albums/{album['id']}", headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_get_all_media(self):
        """Test fetching all media"""
        response = requests.get(f"{API_URL}/media")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} media items")
    
    def test_create_media(self, auth_token, test_album):
        """Test creating a new media item"""
        media_data = {
            "title": f"TEST_Image_{uuid.uuid4().hex[:8]}",
            "url": "https://example.com/test-image.jpg",
            "albumId": test_album["id"],
            "category": "Test"
        }
        response = requests.post(
            f"{API_URL}/media",
            json=media_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == media_data["title"]
        assert data["albumId"] == test_album["id"]
        print(f"✓ Media created with id: {data['id']}")
        
        # Cleanup
        requests.delete(f"{API_URL}/media/{data['id']}", headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_get_media_by_album(self, auth_token, test_album):
        """Test fetching media filtered by album"""
        # Create media in test album
        media_data = {
            "title": f"TEST_Album_Image_{uuid.uuid4().hex[:8]}",
            "url": "https://example.com/album-image.jpg",
            "albumId": test_album["id"],
            "category": "Test"
        }
        create_response = requests.post(
            f"{API_URL}/media",
            json=media_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        media_id = create_response.json()["id"]
        
        # Get media by album
        response = requests.get(f"{API_URL}/media?albumId={test_album['id']}")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert any(m["id"] == media_id for m in data)
        print(f"✓ Media filtered by album correctly")
        
        # Cleanup
        requests.delete(f"{API_URL}/media/{media_id}", headers={"Authorization": f"Bearer {auth_token}"})


class TestReviews:
    """Reviews CRUD tests"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{API_URL}/admin/login", json={"password": ADMIN_PASSWORD})
        return response.json()["token"]
    
    def test_get_all_reviews(self):
        """Test fetching all reviews"""
        response = requests.get(f"{API_URL}/reviews")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} reviews")
    
    def test_create_review(self, auth_token):
        """Test creating a new review"""
        review_data = {
            "name": f"TEST_Reviewer_{uuid.uuid4().hex[:8]}",
            "role": "Test Role",
            "content": "This is a test review content.",
            "rating": 5
        }
        response = requests.post(
            f"{API_URL}/reviews",
            json=review_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == review_data["name"]
        assert data["rating"] == 5
        assert "id" in data
        print(f"✓ Review created with id: {data['id']}")
        
        # Cleanup
        requests.delete(f"{API_URL}/reviews/{data['id']}", headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_update_review(self, auth_token):
        """Test updating a review"""
        # Create review first
        review_data = {
            "name": f"TEST_Update_Review_{uuid.uuid4().hex[:8]}",
            "role": "Original Role",
            "content": "Original content",
            "rating": 4
        }
        create_response = requests.post(
            f"{API_URL}/reviews",
            json=review_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        review_id = create_response.json()["id"]
        
        # Update
        updated_data = {
            "name": review_data["name"],
            "role": "Updated Role",
            "content": "Updated content",
            "rating": 5
        }
        update_response = requests.put(
            f"{API_URL}/reviews/{review_id}",
            json=updated_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        
        # Verify
        get_response = requests.get(f"{API_URL}/reviews")
        reviews = get_response.json()
        updated_review = next((r for r in reviews if r["id"] == review_id), None)
        assert updated_review is not None
        assert updated_review["content"] == "Updated content"
        print(f"✓ Review updated and verified")
        
        # Cleanup
        requests.delete(f"{API_URL}/reviews/{review_id}", headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_delete_review(self, auth_token):
        """Test deleting a review"""
        # Create review first
        review_data = {
            "name": f"TEST_Delete_Review_{uuid.uuid4().hex[:8]}",
            "role": "To Delete",
            "content": "Will be deleted",
            "rating": 3
        }
        create_response = requests.post(
            f"{API_URL}/reviews",
            json=review_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        review_id = create_response.json()["id"]
        
        # Delete
        delete_response = requests.delete(
            f"{API_URL}/reviews/{review_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 200
        print(f"✓ Review deleted successfully")


class TestContact:
    """Contact form tests"""
    
    @pytest.fixture
    def auth_token(self):
        response = requests.post(f"{API_URL}/admin/login", json={"password": ADMIN_PASSWORD})
        return response.json()["token"]
    
    def test_send_contact_message(self, auth_token):
        """Test sending a contact message (no auth required)"""
        message_data = {
            "name": f"TEST_Contact_{uuid.uuid4().hex[:8]}",
            "email": "test@example.com",
            "subject": "Test Subject",
            "message": "This is a test contact message."
        }
        response = requests.post(f"{API_URL}/contact", json=message_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == message_data["name"]
        assert data["email"] == message_data["email"]
        assert "id" in data
        print(f"✓ Contact message sent with id: {data['id']}")
        
        # Cleanup
        requests.delete(f"{API_URL}/contact/{data['id']}", headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_get_contact_messages_requires_auth(self):
        """Test that getting contact messages requires authentication"""
        response = requests.get(f"{API_URL}/contact")
        assert response.status_code == 401
        print(f"✓ Contact messages endpoint correctly requires auth")
    
    def test_get_contact_messages_with_auth(self, auth_token):
        """Test getting contact messages with authentication"""
        response = requests.get(
            f"{API_URL}/contact",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} contact messages")
    
    def test_mark_message_read(self, auth_token):
        """Test marking a message as read"""
        # Create message first
        message_data = {
            "name": f"TEST_Read_{uuid.uuid4().hex[:8]}",
            "email": "test@example.com",
            "subject": "Test",
            "message": "Test message"
        }
        create_response = requests.post(f"{API_URL}/contact", json=message_data)
        message_id = create_response.json()["id"]
        
        # Mark as read
        read_response = requests.put(
            f"{API_URL}/contact/{message_id}/read",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert read_response.status_code == 200
        print(f"✓ Message marked as read")
        
        # Cleanup
        requests.delete(f"{API_URL}/contact/{message_id}", headers={"Authorization": f"Bearer {auth_token}"})


class TestProfile:
    """Profile endpoint tests"""
    
    def test_get_profile(self):
        """Test fetching profile"""
        response = requests.get(f"{API_URL}/profile")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "email" in data
        print(f"✓ Profile fetched: {data.get('name', 'N/A')}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
