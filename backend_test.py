#!/usr/bin/env python3
"""
LWR Portfolio Backend API Test Suite
Tests all backend endpoints for the LWR Portfolio application
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://andrei-portfolio.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'

def log_test(test_name, status, message=""):
    """Log test results with colors"""
    color = Colors.GREEN if status == "PASS" else Colors.RED if status == "FAIL" else Colors.YELLOW
    print(f"{color}{Colors.BOLD}[{status}]{Colors.END} {test_name}")
    if message:
        print(f"    {message}")

def test_root_endpoint():
    """Test GET /api/ - should return status message"""
    try:
        response = requests.get(f"{API_BASE}/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "status" in data:
                log_test("Root Endpoint", "PASS", f"Response: {data}")
                return True
            else:
                log_test("Root Endpoint", "FAIL", f"Missing expected fields in response: {data}")
                return False
        else:
            log_test("Root Endpoint", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        log_test("Root Endpoint", "FAIL", f"Exception: {str(e)}")
        return False

def test_admin_login():
    """Test POST /api/admin/login with password 'lwr2025admin'"""
    try:
        login_data = {"password": "lwr2025admin"}
        response = requests.post(f"{API_BASE}/admin/login", json=login_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and "token" in data:
                log_test("Admin Login", "PASS", f"Token received: {data['token'][:20]}...")
                return data["token"]
            else:
                log_test("Admin Login", "FAIL", f"Login failed: {data}")
                return None
        else:
            log_test("Admin Login", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
            return None
            
    except Exception as e:
        log_test("Admin Login", "FAIL", f"Exception: {str(e)}")
        return None

def test_projects_crud(auth_token):
    """Test Projects CRUD operations"""
    headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}
    
    # Test GET /api/projects (should be empty initially)
    try:
        response = requests.get(f"{API_BASE}/projects", timeout=10)
        if response.status_code == 200:
            projects = response.json()
            log_test("GET Projects (Initial)", "PASS", f"Found {len(projects)} projects")
            initial_count = len(projects)
        else:
            log_test("GET Projects (Initial)", "FAIL", f"Status: {response.status_code}")
            return False
    except Exception as e:
        log_test("GET Projects (Initial)", "FAIL", f"Exception: {str(e)}")
        return False
    
    # Test POST /api/projects (create a test project)
    if not auth_token:
        log_test("POST Projects", "FAIL", "No auth token available")
        return False
        
    try:
        project_data = {
            "title": "Test Portfolio Website",
            "description": "A modern portfolio website built with React and FastAPI",
            "longDescription": "This is a comprehensive portfolio website showcasing various projects and skills. Built using modern web technologies including React for the frontend and FastAPI for the backend API.",
            "category": "Web Development",
            "image": "https://example.com/portfolio-preview.jpg",
            "gallery": [
                "https://example.com/portfolio-1.jpg",
                "https://example.com/portfolio-2.jpg"
            ],
            "technologies": ["React", "FastAPI", "MongoDB", "Tailwind CSS"],
            "featured": True
        }
        
        response = requests.post(f"{API_BASE}/projects", json=project_data, headers=headers, timeout=10)
        
        if response.status_code == 200:
            created_project = response.json()
            log_test("POST Projects", "PASS", f"Created project: {created_project['title']}")
            project_id = created_project["id"]
        else:
            log_test("POST Projects", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        log_test("POST Projects", "FAIL", f"Exception: {str(e)}")
        return False
    
    # Test GET /api/projects (should have one project now)
    try:
        response = requests.get(f"{API_BASE}/projects", timeout=10)
        if response.status_code == 200:
            projects = response.json()
            if len(projects) == initial_count + 1:
                log_test("GET Projects (After Create)", "PASS", f"Found {len(projects)} projects")
                return True
            else:
                log_test("GET Projects (After Create)", "FAIL", f"Expected {initial_count + 1} projects, got {len(projects)}")
                return False
        else:
            log_test("GET Projects (After Create)", "FAIL", f"Status: {response.status_code}")
            return False
    except Exception as e:
        log_test("GET Projects (After Create)", "FAIL", f"Exception: {str(e)}")
        return False

def test_albums_crud(auth_token):
    """Test Albums CRUD operations"""
    headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}
    
    # Test GET /api/albums (should be empty initially)
    try:
        response = requests.get(f"{API_BASE}/albums", timeout=10)
        if response.status_code == 200:
            albums = response.json()
            log_test("GET Albums (Initial)", "PASS", f"Found {len(albums)} albums")
            initial_count = len(albums)
        else:
            log_test("GET Albums (Initial)", "FAIL", f"Status: {response.status_code}")
            return False
    except Exception as e:
        log_test("GET Albums (Initial)", "FAIL", f"Exception: {str(e)}")
        return False
    
    # Test POST /api/albums (create a test album)
    if not auth_token:
        log_test("POST Albums", "FAIL", "No auth token available")
        return False
        
    try:
        album_data = {
            "name": "Electronics Projects Gallery",
            "description": "A collection of my electronics and embedded systems projects",
            "cover": "https://example.com/electronics-cover.jpg"
        }
        
        response = requests.post(f"{API_BASE}/albums", json=album_data, headers=headers, timeout=10)
        
        if response.status_code == 200:
            created_album = response.json()
            log_test("POST Albums", "PASS", f"Created album: {created_album['name']}")
            return True
        else:
            log_test("POST Albums", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        log_test("POST Albums", "FAIL", f"Exception: {str(e)}")
        return False

def test_reviews_crud(auth_token):
    """Test Reviews operations"""
    headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}
    
    # Test POST /api/reviews (create a test review)
    if not auth_token:
        log_test("POST Reviews", "FAIL", "No auth token available")
        return False
        
    try:
        review_data = {
            "name": "Maria Popescu",
            "role": "Project Manager at TechCorp",
            "content": "Andrei delivered an exceptional electronics project for our company. His attention to detail and technical expertise exceeded our expectations. The project was completed on time and within budget.",
            "rating": 5
        }
        
        response = requests.post(f"{API_BASE}/reviews", json=review_data, headers=headers, timeout=10)
        
        if response.status_code == 200:
            created_review = response.json()
            log_test("POST Reviews", "PASS", f"Created review from: {created_review['name']}")
        else:
            log_test("POST Reviews", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        log_test("POST Reviews", "FAIL", f"Exception: {str(e)}")
        return False
    
    # Test GET /api/reviews
    try:
        response = requests.get(f"{API_BASE}/reviews", timeout=10)
        if response.status_code == 200:
            reviews = response.json()
            log_test("GET Reviews", "PASS", f"Found {len(reviews)} reviews")
            return True
        else:
            log_test("GET Reviews", "FAIL", f"Status: {response.status_code}")
            return False
    except Exception as e:
        log_test("GET Reviews", "FAIL", f"Exception: {str(e)}")
        return False

def test_contact_operations(auth_token):
    """Test Contact operations"""
    headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}
    
    # Test POST /api/contact (public, no auth needed)
    try:
        contact_data = {
            "name": "Ion Georgescu",
            "email": "ion.georgescu@example.com",
            "subject": "Collaboration Opportunity",
            "message": "Hello Andrei, I came across your portfolio and I'm impressed with your electronics projects. I would like to discuss a potential collaboration opportunity for an IoT project we're working on. Please let me know if you're interested."
        }
        
        response = requests.post(f"{API_BASE}/contact", json=contact_data, timeout=10)
        
        if response.status_code == 200:
            created_message = response.json()
            log_test("POST Contact (Public)", "PASS", f"Message from: {created_message['name']}")
        else:
            log_test("POST Contact (Public)", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        log_test("POST Contact (Public)", "FAIL", f"Exception: {str(e)}")
        return False
    
    # Test GET /api/contact (requires auth)
    if not auth_token:
        log_test("GET Contact Messages", "FAIL", "No auth token available")
        return False
        
    try:
        response = requests.get(f"{API_BASE}/contact", headers=headers, timeout=10)
        if response.status_code == 200:
            messages = response.json()
            log_test("GET Contact Messages", "PASS", f"Found {len(messages)} contact messages")
            return True
        else:
            log_test("GET Contact Messages", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("GET Contact Messages", "FAIL", f"Exception: {str(e)}")
        return False

def main():
    """Run all backend API tests"""
    print(f"{Colors.BLUE}{Colors.BOLD}=== LWR Portfolio Backend API Test Suite ==={Colors.END}")
    print(f"Testing backend at: {API_BASE}")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Track test results
    results = []
    
    # Test 1: Root endpoint
    print(f"{Colors.YELLOW}1. Testing Root Endpoint{Colors.END}")
    results.append(test_root_endpoint())
    print()
    
    # Test 2: Admin login
    print(f"{Colors.YELLOW}2. Testing Admin Login{Colors.END}")
    auth_token = test_admin_login()
    results.append(auth_token is not None)
    print()
    
    # Test 3: Projects CRUD
    print(f"{Colors.YELLOW}3. Testing Projects CRUD{Colors.END}")
    results.append(test_projects_crud(auth_token))
    print()
    
    # Test 4: Albums CRUD
    print(f"{Colors.YELLOW}4. Testing Albums CRUD{Colors.END}")
    results.append(test_albums_crud(auth_token))
    print()
    
    # Test 5: Reviews
    print(f"{Colors.YELLOW}5. Testing Reviews{Colors.END}")
    results.append(test_reviews_crud(auth_token))
    print()
    
    # Test 6: Contact
    print(f"{Colors.YELLOW}6. Testing Contact Operations{Colors.END}")
    results.append(test_contact_operations(auth_token))
    print()
    
    # Summary
    passed = sum(results)
    total = len(results)
    
    print(f"{Colors.BLUE}{Colors.BOLD}=== Test Summary ==={Colors.END}")
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print(f"{Colors.GREEN}{Colors.BOLD}All tests passed! ✅{Colors.END}")
        return 0
    else:
        print(f"{Colors.RED}{Colors.BOLD}Some tests failed! ❌{Colors.END}")
        return 1

if __name__ == "__main__":
    sys.exit(main())