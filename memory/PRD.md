# lwr.ro - Portfolio Personal

## Problem Statement
Utilizatorul dorește un site de portofoliu personal (lwr.ro) cu design negru și accente roșii.

## Owner Info
- **Nume**: Vacaru Andrei Laurentiu (Lawrin)
- **Email**: contact@lwr.ro
- **Universitate**: Universitatea Politehnica București
- **Facultate**: Facultatea de Transporturi - Electronică

## Social Media Links
- Instagram: https://www.instagram.com/lawrin.tho/
- LinkedIn: https://www.linkedin.com/in/lawrin/
- GitHub: https://github.com/IamLawrin

## Core Requirements
1. **Design**: Temă neagră cu accente roșii ✅
2. **Admin Panel**: Login cu parolă (fără username) - parolă: `lwr2025admin` ✅
3. **Pagina Media (/media)**: 
   - Header care se ascunde la scroll ✅
   - Imagini mari (grid de maxim 3) ✅
   - Hero section cu citat și prezentare ✅
   - Slideshow cu ultimele 5 coperți de albume ✅
   - Albume/foldere cu imagine copertă ✅
   - Click pe album deschide galeria ✅
   - Imagini cu colțuri drepte și spațiu minimal ✅
   - Support pentru tags/categorii ✅
   - Zoom full-screen la click pe imagine ✅
   - Admin: creare albume și upload imagini ✅
4. **Pagina Proiecte**:
   - Click pe proiect deschide pagină de detalii ✅
   - Galerie de imagini în detalii ✅
   - Upload imagini pentru proiecte ✅
5. **Formular Contact**: Salvează mesajele în baza de date ✅
6. **Secțiunea About**: Nume, vârstă, studii ✅
7. **Internaționalizare**: RO (implicit) / EN cu switcher în header ✅
8. **Badge "NOU/NEW"**: Apare pe conținut nou timp de 7 zile ✅
9. **Link-uri Social Media**: Instagram, LinkedIn, GitHub în footer ✅

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn/UI
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Auth**: JWT token-based

## Architecture
```
/app
├── backend
│   ├── server.py       # Main FastAPI app
│   ├── routes.py       # All API endpoints
│   ├── models.py       # Pydantic models
│   └── .env
└── frontend
    ├── src
    │   ├── components/
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── LanguageContext.js
    │   ├── pages/
    │   ├── services/
    │   │   └── api.js
    │   └── data/
    │       └── mockData.js (doar pentru profileData)
    └── .env
```

## API Endpoints
- `POST /api/admin/login` - Autentificare admin
- `GET /api/admin/verify` - Verificare token
- `POST /api/upload` - Upload imagine
- `GET/POST /api/projects` - Listare/Creare proiecte
- `GET/PUT/DELETE /api/projects/{id}` - CRUD proiect individual
- `GET/POST /api/albums` - Listare/Creare albume
- `PUT/DELETE /api/albums/{id}` - CRUD album
- `GET/POST/DELETE /api/media` - CRUD media/imagini
- `GET/POST /api/reviews` - Listare/Creare recenzii
- `PUT/DELETE /api/reviews/{id}` - CRUD recenzie
- `POST /api/contact` - Trimite mesaj contact
- `GET /api/contact` - Listare mesaje (admin)

## Credentials
- **Admin Password**: `lwr2025admin`

## Completed (January 2026)
- [x] Full-stack integration completed
- [x] Backend API tested (23/23 tests passed)
- [x] Frontend integrated with backend API
- [x] ProjectDetailPage fixed to use API instead of mock data
- [x] HomePage updated to fetch projects/reviews from API
- [x] Social media links added (Instagram, LinkedIn, GitHub)
- [x] Language switcher (RO/EN) working
- [x] NEW badge working on recent content

## Backlog
- [ ] User-specific email sending for contact form (user mentioned handling later)

## Testing
- Backend: 23/23 pytest tests passing
- Frontend: All features tested and working
- Test files: `/app/tests/test_portfolio_api.py`
