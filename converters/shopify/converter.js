// converters/shopify/converter.js
class ShopifyConverter {
  convertToLiquid(projectData) {
    const sections = JSON.parse(projectData.template_data);
    const liquidFiles = {};
    
    // layout/theme.liquid
    liquidFiles['layout/theme.liquid'] = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  {{ 'theme.css' | asset_url | stylesheet_tag }}
  {% if template contains 'product' %}
    <script>
      window.productData = {{ product | json }};
    </script>
  {% endif %}
</head>
<body>
  {% section 'header' %}
  <main role="main">
    {{ content_for_layout }}
  </main>
  {% section 'footer' %}
</body>
</html>
    `;
    
    // Convertir chaque section
    sections.forEach(section => {
      liquidFiles[`sections/${section.id}.liquid`] = this.sectionToLiquid(section);
    });
    
    return liquidFiles;
  }
  
  sectionToLiquid(section) {
    if (section.type === 'product-grid') {
      return `
{% schema %}
{
  "name": "Grille de produits",
  "settings": [
    {
      "type": "collection",
      "id": "collection",
      "label": "Collection"
    }
  ]
}
{% endschema %}

<div class="product-grid">
  {% for product in collections[section.settings.collection].products %}
    <div class="product-card">
      <a href="{{ product.url }}">
        <img src="{{ product.featured_image | img_url: '300x300' }}" alt="{{ product.title }}">
      </a>
      <h3>{{ product.title }}</h3>
      <p class="price">{{ product.price | money }}</p>
      <form action="/cart/add" method="post">
        <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
        <button type="submit">Ajouter au panier</button>
      </form>
    </div>
  {% endfor %}
</div>
      `;
    }
    // Autres types de sections...
  }
}
module.exports = ShopifyConverter;
