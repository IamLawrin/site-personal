from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid


def generate_id():
    return str(uuid.uuid4())


# Auth Models
class AdminLogin(BaseModel):
    password: str


class TokenResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    message: Optional[str] = None


# Project Models
class ProjectBase(BaseModel):
    title: str
    description: str
    longDescription: Optional[str] = ""
    category: str
    image: str = ""
    gallery: List[str] = []
    technologies: List[str] = []
    featured: bool = False


class ProjectCreate(ProjectBase):
    pass


class Project(ProjectBase):
    id: str = Field(default_factory=generate_id)
    date: str = Field(default_factory=lambda: datetime.utcnow().strftime('%Y-%m-%d'))
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


# Album Models
class AlbumBase(BaseModel):
    name: str
    description: Optional[str] = ""
    cover: str = ""


class AlbumCreate(AlbumBase):
    pass


class Album(AlbumBase):
    id: str = Field(default_factory=generate_id)
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().strftime('%Y-%m-%d'))


# Media Image Models
class MediaImageBase(BaseModel):
    title: str
    url: str
    albumId: str
    category: Optional[str] = ""


class MediaImageCreate(MediaImageBase):
    pass


class MediaImage(MediaImageBase):
    id: str = Field(default_factory=generate_id)
    date: str = Field(default_factory=lambda: datetime.utcnow().strftime('%Y-%m-%d'))


# Review Models
class ReviewBase(BaseModel):
    name: str
    role: str
    content: str
    rating: int = Field(ge=1, le=5)


class ReviewCreate(ReviewBase):
    pass


class Review(ReviewBase):
    id: str = Field(default_factory=generate_id)
    date: str = Field(default_factory=lambda: datetime.utcnow().strftime('%Y-%m-%d'))


# Contact Models
class ContactMessageBase(BaseModel):
    name: str
    email: str
    subject: str
    message: str


class ContactMessageCreate(ContactMessageBase):
    pass


class ContactMessage(ContactMessageBase):
    id: str = Field(default_factory=generate_id)
    read: bool = False
    date: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


# Profile Models
class Profile(BaseModel):
    name: str = "Vacaru Andrei Laurentiu"
    shortName: str = "Lawrin"
    title: str = "Electronics Student & Developer"
    age: int = 21
    university: str = "Universitatea Politehnica București"
    faculty: str = "Facultatea de Transporturi - Electronică"
    bio: str = "Pasionat de electronică, programare și proiecte creative."
    email: str = "contact@lwr.ro"
    instagram: str = "#"
    linkedin: str = "#"
    github: str = "#"
