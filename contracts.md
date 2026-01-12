# API Contracts - lwr.ro Portfolio

## Overview
Backend API pentru portofoliul personal lwr.ro cu autentificare admin, CRUD pentru proiecte, albume, imagini, recenzii și mesaje de contact.

---

## Authentication

### POST /api/admin/login
Autentificare admin cu parolă.

**Request:**
```json
{ "password": "string" }
```

**Response:**
```json
{ "success": true, "token": "jwt_token" }
```

---

## Projects

### GET /api/projects
Returnează toate proiectele.

**Response:**
```json
[{
  "id": "string",
  "title": "string",
  "description": "string",
  "longDescription": "string",
  "category": "string",
  "image": "string (URL)",
  "gallery": ["string (URLs)"],
  "technologies": ["string"],
  "featured": "boolean",
  "date": "string (ISO date)",
  "createdAt": "string (ISO date)"
}]
```

### GET /api/projects/:id
Returnează un proiect după ID.

### POST /api/projects (Admin)
Creează un proiect nou.

### PUT /api/projects/:id (Admin)
Actualizează un proiect.

### DELETE /api/projects/:id (Admin)
Șterge un proiect.

---

## Albums

### GET /api/albums
Returnează toate albumele.

**Response:**
```json
[{
  "id": "string",
  "name": "string",
  "description": "string",
  "cover": "string (URL)",
  "createdAt": "string (ISO date)"
}]
```

### POST /api/albums (Admin)
Creează un album nou.

### PUT /api/albums/:id (Admin)
Actualizează un album.

### DELETE /api/albums/:id (Admin)
Șterge un album și toate imaginile asociate.

---

## Media Images

### GET /api/media
Returnează toate imaginile.

### GET /api/media?albumId=:albumId
Returnează imaginile dintr-un album.

**Response:**
```json
[{
  "id": "string",
  "title": "string",
  "url": "string",
  "albumId": "string",
  "category": "string",
  "date": "string (ISO date)"
}]
```

### POST /api/media (Admin)
Adaugă o imagine nouă.

### DELETE /api/media/:id (Admin)
Șterge o imagine.

---

## Reviews

### GET /api/reviews
Returnează toate recenziile.

**Response:**
```json
[{
  "id": "string",
  "name": "string",
  "role": "string",
  "content": "string",
  "rating": "number (1-5)",
  "date": "string (ISO date)"
}]
```

### POST /api/reviews (Admin)
Adaugă o recenzie nouă.

### PUT /api/reviews/:id (Admin)
Actualizează o recenzie.

### DELETE /api/reviews/:id (Admin)
Șterge o recenzie.

---

## Contact Messages

### GET /api/contact (Admin)
Returnează toate mesajele de contact.

**Response:**
```json
[{
  "id": "string",
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "read": "boolean",
  "date": "string (ISO date)"
}]
```

### POST /api/contact
Trimite un mesaj de contact (public).

### PUT /api/contact/:id/read (Admin)
Marchează mesajul ca citit.

### DELETE /api/contact/:id (Admin)
Șterge un mesaj.

---

## File Upload

### POST /api/upload (Admin)
Upload imagine pe server.

**Request:** multipart/form-data cu câmpul "file"

**Response:**
```json
{ "url": "/uploads/filename.jpg" }
```

---

## Profile Settings

### GET /api/profile
Returnează datele profilului.

### PUT /api/profile (Admin)
Actualizează datele profilului.

---

## Mock Data to Replace

### Frontend files using mock data:
- `src/data/mockData.js` - toate datele mock
- `src/pages/MediaPage.jsx` - albums state
- `src/pages/ProjectsPage.jsx` - projects state  
- `src/pages/ReviewsPage.jsx` - reviews state
- `src/pages/ContactPage.jsx` - form submission
- `src/pages/HomePage.jsx` - profile, featured projects, reviews

### Integration steps:
1. Creează API services în frontend
2. Înlocuiește useState cu useEffect + fetch
3. Adaugă token JWT în header pentru requests admin
4. Implementează upload real pentru imagini
