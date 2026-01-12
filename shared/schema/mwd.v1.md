# Maziweb Document (MWD) v1 — format canonique

MWD v1 est le format unique stocké dans `template_data`.
Tous les modules doivent produire/consommer ce format :
- frontend (éditeur) : génère du MWD
- backend : stocke `template_data` (MWD)
- scraper : convertit un site importé en MWD
- converters : transforment MWD en Shopify / Static / WordPress

---

## Structure

- `version`: string (toujours "mwd.v1")
- `pages`: liste de pages
- `pages[].blocks`: liste de blocs (sections)
- `blocks[].type`: type de bloc (ex: "hero", "productGrid")
- `blocks[].props`: données du bloc
- `blocks[].style`: styles simples (optionnel)

---

## Exemple minimal

```json
{
  "version": "mwd.v1",
  "pages": [
    {
      "id": "home",
      "name": "Accueil",
      "route": "/",
      "blocks": [
        {
          "id": "b1",
          "type": "hero",
          "props": {
            "title": "Votre Titre Ici",
            "subtitle": "Description",
            "ctaText": "Appel à l'action",
            "ctaHref": "#"
          },
          "style": { "padding": "80px 20px", "background": "#f8f9fa" }
        },
        {
          "id": "b2",
          "type": "productGrid",
          "props": {
            "collectionHandle": "frontpage",
            "columnsMin": 300
          },
          "style": { "padding": "40px" }
        }
      ]
    }
  ],
  "assets": [],
  "globals": {}
}
