{
  "version": "mwd.v1",
  "project": { "id": "p1", "name": "Demo" },
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
            "subtitle": "Description de votre entreprise",
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
  "globals": { "theme": { "primaryColor": "#007bff" } }
}
