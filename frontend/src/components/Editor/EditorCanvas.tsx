// frontend/src/components/Editor/EditorCanvas.tsx
import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

import { exportMWD } from '../../mwd/exportMWD';
import { saveProjectToBackend, exportProject } from '../../api/client';

export default function EditorCanvas() {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const lastProjectIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!editorContainerRef.current) return;

    const editor = grapesjs.init({
      container: editorContainerRef.current,
      height: '100vh',
      storageManager: { type: 'local', autosave: true },
      blockManager: {
        blocks: [
          {
            id: 'hero',
            label: 'Hero',
            content: `
              <section style="padding:80px 20px;background:#f8f9fa;">
                <h1>Maziweb AI</h1>
                <p>Hero section</p>
                <a href="#" style="display:inline-block;padding:12px 30px;background:#007bff;color:#fff;text-decoration:none;border-radius:6px;">CTA</a>
              </section>
            `,
          },
          {
            id: 'product-grid',
            label: 'Product Grid (placeholder)',
            content: `
              <section style="padding:40px;">
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;">
                  <div style="border:1px solid #ddd;border-radius:8px;padding:16px;">
                    <img src="https://via.placeholder.com/300x200" style="width:100%;height:auto;">
                    <h3>Produit</h3>
                    <p>29.99€</p>
                  </div>
                </div>
              </section>
            `,
          },
        ],
      },
      panels: {
        defaults: [
          {
            id: 'actions',
            buttons: [
              { id: 'export-mwd', label: 'Export MWD', command: 'export-mwd' },
              { id: 'save', label: 'Save', command: 'save' },
              { id: 'export-static', label: 'Export Static', command: 'export-static' },
              { id: 'export-shopify', label: 'Export Shopify', command: 'export-shopify' },
            ],
          },
        ],
      },
    });

    editor.Commands.add('export-mwd', {
      run: (ed) => {
        const mwd = exportMWD(ed);
        const win = window.open('', '_blank');
        const text = JSON.stringify(mwd, null, 2);
        if (win) win.document.write(`<pre style="white-space:pre-wrap;">${text}</pre>`);
      },
    });

    editor.Commands.add('save', {
      run: async (ed) => {
        try {
          const name = window.prompt('Nom du projet ?', 'Demo') || 'Demo';
          const mwd = exportMWD(ed);
          const saved = await saveProjectToBackend({
            name,
            template_data: mwd,
            target_platform: null,
          });
          lastProjectIdRef.current = saved.id;
          alert(`Saved ✅ id=${saved.id}`);
        } catch (e: any) {
          alert(`Erreur Save ❌: ${e?.message || e}`);
        }
      },
    });

    editor.Commands.add('export-static', {
      run: async () => {
        try {
          const id = lastProjectIdRef.current;
          if (!id) return alert('Fais Save avant.');
          const result = await exportProject('static', id);
          const win = window.open('', '_blank');
          const text = JSON.stringify(result, null, 2);
          if (win) win.document.write(`<pre style="white-space:pre-wrap;">${text}</pre>`);
        } catch (e: any) {
          alert(`Erreur Export Static ❌: ${e?.message || e}`);
        }
      },
    });

    editor.Commands.add('export-shopify', {
      run: async () => {
        try {
          const id = lastProjectIdRef.current;
          if (!id) return alert('Fais Save avant.');
          const result = await exportProject('shopify', id);
          const win = window.open('', '_blank');
          const text = JSON.stringify(result, null, 2);
          if (win) win.document.write(`<pre style="white-space:pre-wrap;">${text}</pre>`);
        } catch (e: any) {
          alert(`Erreur Export Shopify ❌: ${e?.message || e}`);
        }
      },
    });

    return () => editor.destroy();
  }, []);

  return <div ref={editorContainerRef} />;
}
