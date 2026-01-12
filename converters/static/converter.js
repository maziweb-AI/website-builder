// converters/static/converter.js
class StaticConverter {
  convertToStatic(projectData) {
    const sections =
      typeof projectData.template_data === 'string'
        ? JSON.parse(projectData.template_data)
        : projectData.template_data;

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${projectData.name || 'Site'}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  ${sections.map((s) => s.html || `<div>TODO section: ${s.type}</div>`).join('\n')}
</body>
</html>`;

    const css = `/* TODO: générer le CSS proprement */\n`;

    return [
      { path: 'index.html', content: html },
      { path: 'styles.css', content: css },
    ];
  }
}

module.exports = StaticConverter;
