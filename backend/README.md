# Backend (API)

API Express + PostgreSQL (MVP).

## Endpoints (MVP)
- GET /health
- POST /api/projects
- GET /api/projects/:id
- POST /api/export/:platform  (body: { "projectId": 123 })

## Variables d’environnement
Voir `.env.example` à la racine du repo.

## Démarrage sur PC (recommandé)
1) Lancer PostgreSQL avec Docker :
```bash
cd backend
docker compose up -d
