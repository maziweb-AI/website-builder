# Maziweb AI (website builder)

Constructeur de sites web avec :
- un éditeur visuel (frontend)
- une API + base de données (backend)
- un module d’import/clonage (scraper)
- des convertisseurs d’export (Shopify / Static / WordPress)

## Structure du repo
- `frontend/` : éditeur visuel (GrapesJS)
- `backend/` : API Express + PostgreSQL
- `scraper/` : import/clonage de sites
- `converters/` : export par plateforme
- `templates/` : bibliothèque de composants
- `shared/schema/` : formats partagés (MWD)

## Format canonique
Le format unique stocké dans `template_data` est **MWD v1** :
- doc : `shared/schema/mwd.v1.md`

Tous les modules doivent produire/consommer ce format :
frontend → backend → converters, et scraper → MWD.

## MVP actuel
- Export `static` (HTML/CSS)
- Export `shopify` (Liquid sections)
- Backend prêt DB-first (table `projects`)
