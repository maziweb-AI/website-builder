// converters/shopify/converter.js
class ShopifyConverter {
  convertToLiquid(projectData) {
    const doc =
      typeof projectData.template_data === 'string'
        ? JSON.parse(projectData.template_data)
        : projectData.template_data;

    // MWD v1: on prend la première page (MVP)
    const page = (doc.pages && doc.pages[0]) || { blocks: [] };
    const blocks = page.blocks || [];

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

    // Convertir chaque bloc MWD en section Shopify
    blocks.forEach((block) => {
      liquidFiles[`sections/${block.id}.liquid`] = this.blockToLiquid(block);
    });

    return liquidFiles;
  }

  blockToLiquid(block) {
    // productGrid (MWD)
    if (block.type === 'productGrid') {
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

    // hero (MWD) — version simple
    if (block.type === 'hero') {
      const title = block.props?.title || 'Titre';
      const subtitle = block.props?.subtitle || '';
      const ctaText = block.props?.ctaText || 'CTA';
      const ctaHref = block.props?.ctaHref || '#';

      return `
{% schema %}
{
  "name": "Hero",
  "settings": []
}
{% endschema %}

<section class="hero" style="padding: 80px 20px; background: #f8f9fa;">
  <h1>${title}</h1>
  <p>${subtitle}</p>
  <a href="${ctaHref}" class="btn">${ctaText}</a>
</section>
      `;
    }

    // Fallback si le type n'est pas encore géré
    return `<div>TODO block: ${block.type}</div>`;
  }
}

module.exports = ShopifyConverter;
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

    // Fallback si le type n'est pas encore géré
    return `<div>TODO section: ${section.type}</div>`;
  }
}

module.exports = ShopifyConverter;
