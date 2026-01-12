// converters/static/converter.js
class StaticConverter {
  convertToStatic(projectData) {
    const doc =
      typeof projectData.template_data === 'string'
        ? JSON.parse(projectData.template_data)
        : projectData.template_data;

    // MWD v1: on prend la première page (MVP)
    const page = (doc.pages && doc.pages[0]) || { blocks: [] };
    const blocks = page.blocks || [];

    const bodyHtml = blocks.map((b) => this.blockToHtml(b)).join('\n');

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${projectData.name || page.name || 'Site'}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
${bodyHtml}
</body>
</html>`;

    const css = `/* MVP: CSS minimal (à améliorer plus tard) */
body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
.hero { padding: 80px 20px; background: #f8f9fa; }
.hero .btn { display: inline-block; padding: 12px 30px; background: #007bff; color: #fff; text-decoration: none; border-radius: 5px; }
.product-grid { padding: 40px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.product-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
`;

    return [
      { path: 'index.html', content: html },
      { path: 'styles.css', content: css },
    ];
  }

  blockToHtml(block) {
    if (block.type === 'hero') {
      const title = block.props?.title || 'Votre titre';
      const subtitle = block.props?.subtitle || '';
      const ctaText = block.props?.ctaText || 'Appel à l’action';
      const ctaHref = block.props?.ctaHref || '#';

      return `
<section class="hero">
  <h1>${title}</h1>
  <p>${subtitle}</p>
  <a class="btn" href="${ctaHref}">${ctaText}</a>
</section>
      `.trim();
    }

    if (block.type === 'productGrid') {
      // En static, on ne peut pas lister de vrais produits sans data.
      // MVP: on met une grille "placeholder".
      return `
<section class="product-grid">
  <div class="product-card">
    <img src="https://via.placeholder.com/300x200" style="width:100%;height:auto;" alt="Produit" />
    <h3>Nom du Produit</h3>
    <p class="price">29.99€</p>
    <button style="width:100%;padding:10px;border:none;border-radius:5px;">Ajouter au panier</button>
  </div>
</section>
      `.trim();
    }

    return `<div>TODO block: ${block.type}</div>`;
  }
}

module.exports = StaticConverter;

