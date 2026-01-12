# Backend (API)

API Express + PostgreSQL (MVP).

## Endpoints (MVP)
- GET /health
- POST /api/projects
- GET /api/projects/:id
- POST /api/export/:platform  (body: { "projectId": 123 })

## Variables d’environnement
Voir `.env.example` à la racine.

## DB
Le schéma est dans `backend/db/schema.sql` (table `projects`).

## Notes
- Auth non implémentée (user_id = 1 en dur pour l’instant).
- `template_data` doit respecter le format MWD v1 (`shared/schema/mwd.v1.md`).
