# API Spec (draft)

## Auth
- POST /auth/login
- POST /auth/register

## Projects
- GET /projects
- POST /projects
- GET /projects/:id
- PUT /projects/:id
- DELETE /projects/:id

## Pages
- GET /projects/:id/pages
- POST /projects/:id/pages
- PUT /pages/:pageId
- DELETE /pages/:pageId

## Export
- POST /export/static
- POST /export/shopify
- POST /export/wordpress
