// frontend/src/mwd/exportMWD.js

// MVP: transforme le HTML/CSS de GrapesJS en MWD v1 très simple.
// Plus tard, on convertira en "blocks" propres (hero, productGrid, etc.)
export function exportMWD(editor) {
  const html = editor.getHtml();
  const css = editor.getCss();

  return {
    version: 'mwd.v1',
    pages: [
      {
        id: 'home',
        name: 'Accueil',
        route: '/',
        blocks: [
          {
            id: 'b1',
            type: 'raw',
            props: {
              html,
              css,
            },
          },
        ],
      },
    ],
    assets: [],
    globals: {},
  };
}
