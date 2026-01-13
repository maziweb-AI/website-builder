// frontend/src/mwd/exportMWD.ts
export function exportMWD(editor: any) {
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
            props: { html, css },
          },
        ],
      },
    ],
    assets: [],
    globals: {},
  };
}
