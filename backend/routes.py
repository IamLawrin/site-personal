from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
import jwt
import os
from datetime import datetime, timedelta
import uuid
import shutil
from pathlib import Path

from models import (
    AdminLogin, TokenResponse,
    Project, ProjectCreate,
    Album, AlbumCreate,
    MediaImage, MediaImageCreate,
    Review, ReviewCreate,
    ContactMessage, ContactMessageCreate,
    Profile
)

router = APIRouter()
security = HTTPBearer(auto_error=False)

# Config
SECRET_KEY = os.environ.get('JWT_SECRET', 'lwr-secret-key-2025')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'lwr2025admin')
UPLOAD_DIR = Path('/app/backend/uploads')
UPLOAD_DIR.mkdir(exist_ok=True)

# In-memory database reference (will be set from server.py)
db = None

def set_db(database):
    global db
    db = database


# JWT Helper
def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=7)
    data['exp'] = expire
    return jwt.encode(data, SECRET_KEY, algorithm='HS256')


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ==================== AUTH ====================

@router.post('/admin/login', response_model=TokenResponse)
async def admin_login(data: AdminLogin):
    if data.password == ADMIN_PASSWORD:
        token = create_token({'admin': True})
        return TokenResponse(success=True, token=token)
    return TokenResponse(success=False, message="Parolă incorectă")


@router.get('/admin/verify')
async def verify_admin(payload: dict = Depends(verify_token)):
    return {'valid': True, 'admin': payload.get('admin', False)}


# ==================== PROJECTS ====================

@router.get('/projects', response_model=List[Project])
async def get_projects():
    projects = await db.projects.find().sort('createdAt', -1).to_list(1000)
    return [Project(**p) for p in projects]


@router.get('/projects/{project_id}', response_model=Project)
async def get_project(project_id: str):
    project = await db.projects.find_one({'id': project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project(**project)


@router.post('/projects', response_model=Project)
async def create_project(data: ProjectCreate, _: dict = Depends(verify_token)):
    project = Project(**data.dict())
    await db.projects.insert_one(project.dict())
    return project


@router.put('/projects/{project_id}', response_model=Project)
async def update_project(project_id: str, data: ProjectCreate, _: dict = Depends(verify_token)):
    existing = await db.projects.find_one({'id': project_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Project not found")
    
    updated = {**existing, **data.dict()}
    await db.projects.update_one({'id': project_id}, {'$set': data.dict()})
    return Project(**updated)


@router.delete('/projects/{project_id}')
async def delete_project(project_id: str, _: dict = Depends(verify_token)):
    result = await db.projects.delete_one({'id': project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {'success': True}


# ==================== ALBUMS ====================

@router.get('/albums', response_model=List[Album])
async def get_albums():
    albums = await db.albums.find().sort('createdAt', -1).to_list(1000)
    return [Album(**a) for a in albums]


@router.post('/albums', response_model=Album)
async def create_album(data: AlbumCreate, _: dict = Depends(verify_token)):
    album = Album(**data.dict())
    await db.albums.insert_one(album.dict())
    return album


@router.put('/albums/{album_id}', response_model=Album)
async def update_album(album_id: str, data: AlbumCreate, _: dict = Depends(verify_token)):
    existing = await db.albums.find_one({'id': album_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Album not found")
    
    updated = {**existing, **data.dict()}
    await db.albums.update_one({'id': album_id}, {'$set': data.dict()})
    return Album(**updated)


@router.delete('/albums/{album_id}')
async def delete_album(album_id: str, _: dict = Depends(verify_token)):
    # Delete album and its images
    await db.media.delete_many({'albumId': album_id})
    result = await db.albums.delete_one({'id': album_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Album not found")
    return {'success': True}


# ==================== MEDIA IMAGES ====================

@router.get('/media', response_model=List[MediaImage])
async def get_media(albumId: Optional[str] = None):
    query = {'albumId': albumId} if albumId else {}
    images = await db.media.find(query).sort('date', -1).to_list(1000)
    return [MediaImage(**img) for img in images]


@router.post('/media', response_model=MediaImage)
async def create_media(data: MediaImageCreate, _: dict = Depends(verify_token)):
    image = MediaImage(**data.dict())
    await db.media.insert_one(image.dict())
    return image


@router.delete('/media/{image_id}')
async def delete_media(image_id: str, _: dict = Depends(verify_token)):
    result = await db.media.delete_one({'id': image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {'success': True}


# ==================== REVIEWS ====================

@router.get('/reviews', response_model=List[Review])
async def get_reviews():
    reviews = await db.reviews.find().sort('date', -1).to_list(1000)
    return [Review(**r) for r in reviews]


@router.post('/reviews', response_model=Review)
async def create_review(data: ReviewCreate, _: dict = Depends(verify_token)):
    review = Review(**data.dict())
    await db.reviews.insert_one(review.dict())
    return review


@router.put('/reviews/{review_id}', response_model=Review)
async def update_review(review_id: str, data: ReviewCreate, _: dict = Depends(verify_token)):
    existing = await db.reviews.find_one({'id': review_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Review not found")
    
    updated = {**existing, **data.dict()}
    await db.reviews.update_one({'id': review_id}, {'$set': data.dict()})
    return Review(**updated)


@router.delete('/reviews/{review_id}')
async def delete_review(review_id: str, _: dict = Depends(verify_token)):
    result = await db.reviews.delete_one({'id': review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {'success': True}


# ==================== CONTACT ====================

@router.get('/contact', response_model=List[ContactMessage])
async def get_contact_messages(_: dict = Depends(verify_token)):
    messages = await db.contact.find().sort('date', -1).to_list(1000)
    return [ContactMessage(**m) for m in messages]


@router.post('/contact', response_model=ContactMessage)
async def create_contact_message(data: ContactMessageCreate):
    message = ContactMessage(**data.dict())
    await db.contact.insert_one(message.dict())
    return message


@router.put('/contact/{message_id}/read')
async def mark_message_read(message_id: str, _: dict = Depends(verify_token)):
    result = await db.contact.update_one({'id': message_id}, {'$set': {'read': True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {'success': True}


@router.delete('/contact/{message_id}')
async def delete_contact_message(message_id: str, _: dict = Depends(verify_token)):
    result = await db.contact.delete_one({'id': message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {'success': True}


# ==================== PROFILE ====================

@router.get('/profile', response_model=Profile)
async def get_profile():
    profile = await db.profile.find_one({})
    if profile:
        return Profile(**profile)
    # Return default profile
    return Profile()


@router.put('/profile', response_model=Profile)
async def update_profile(data: Profile, _: dict = Depends(verify_token)):
    await db.profile.delete_many({})
    await db.profile.insert_one(data.dict())
    return data


# ==================== FILE UPLOAD ====================

@router.post('/upload')
async def upload_file(file: UploadFile = File(...), _: dict = Depends(verify_token)):
    # Generate unique filename
    ext = Path(file.filename).suffix
    filename = f"{uuid.uuid4()}{ext}"
    filepath = UPLOAD_DIR / filename
    
    # Save file
    with open(filepath, 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL
    return {'url': f'/api/uploads/{filename}'}
