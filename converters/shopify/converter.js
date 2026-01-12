// converters/shopify/converter.js
class ShopifyConverter {
  convertToLiquid(projectData) {
    const doc =
      typeof projectData.template_data === 'string'
        ? JSON.parse(projectData.template_data)
        : projectData.template_data;

    const page = doc && doc.pages && doc.pages[0] ? doc.pages[0] : { blocks: [] };
    const blocks = page.blocks || [];

    const liquidFiles = {};

    liquidFiles['layout/theme.liquid'] = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  {{ 'theme.css' | asset_url | stylesheet_tag }}
</head>
<body>
  <main role="main">
    {{ content_for_layout }}
  </main>
</body>
</html>
    `;

    blocks.forEach((block) => {
      liquidFiles['sections/' + block.id + '.liquid'] = this.blockToLiquid(block);
    });

    return liquidFiles;
  }

  blockToLiquid(block) {
    if (block.type === 'productGrid') {
      return `
{% schema %}
{
  "name": "Grille de produits",
  "settings": [
    { "type": "collection", "id": "collection", "label": "Collection" }
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
    </div>
  {% endfor %}
</div>
      `;
    }

    if (block.type === 'hero') {
      const props = block.props || {};
      const title = props.title || 'Titre';
      const subtitle = props.subtitle || '';
      const ctaText = props.ctaText || 'CTA';
      const ctaHref = props.ctaHref || '#';

      return `
{% schema %}
{ "name": "Hero", "settings": [] }
{% endschema %}

<section class="hero">
  <h1>${title}</h1>
  <p>${subtitle}</p>
  <a href="${ctaHref}" class="btn">${ctaText}</a>
</section>
      `;
    }

    return `<div>TODO block: ${block.type}</div>`;
  }
}

module.exports = ShopifyConverter;
