// frontend/components/Editor/EditorCanvas.tsx
import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

import { exportMWD } from '../../src/mwd/exportMWD';
import { saveProjectToBackend, exportProject } from '../../src/api/client';

const EditorCanvas = () => {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const lastProjectIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!editorContainerRef.current) return;

    const editor = grapesjs.init({
      container: editorContainerRef.current,
      height: '100vh',
      width: 'auto',
      storageManager: {
        type: 'local',
        autosave: true,
      },
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Tablet', width: '768px' },
          { name: 'Mobile', width: '320px' },
        ],
      },
      blockManager: {
        appendTo: '.blocks-container',
        blocks: [
          {
            id: 'hero-section',
            label: 'Hero Section',
            content: `
              <div class="hero-section" style="padding: 80px 20px; background: #f8f9fa;">
                <h1 style="font-size: 48px; margin-bottom: 20px;">Votre Titre Ici</h1>
                <p style="font-size: 20px; margin-bottom: 30px;">Description de votre entreprise</p>
                <a href="#" class="btn" style="padding: 12px 30px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                  Appel à l'action
                </a>
              </div>
            `,
          },
          {
            id: 'product-grid',
            label: 'Grille Produits',
            content: `
              <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; padding: 40px;">
                <div class="product-card" style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                  <img src="https://via.placeholder.com/300x200" style="width: 100%; height: auto;">
                  <h3>Nom du Produit</h3>
                  <p class="price">29.99€</p>
                  <button style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 5px;">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            `,
          },
        ],
      },
      panels: {
        defaults: [
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [
              { id: 'device-desktop', label: 'Desktop', command: 'set-device-desktop', active: true },
              { id: 'device-tablet', label: 'Tablet', command: 'set-device-tablet' },
              { id: 'device-mobile', label: 'Mobile', command: 'set-device-mobile' },
            ],
          },
          {
            id: 'panel-actions',
            el: '.panel__actions',
            buttons: [
              { id: 'export-mwd', label: 'Export MWD', command: 'export-mwd' },
              { id: 'save-project', label: 'Save', command: 'save-project' },
              { id: 'export-static', label: 'Export Static', command: 'export-static' },
              { id: 'export-shopify', label: 'Export Shopify', command: 'export-shopify' },
            ],
          },
        ],
      },
    });

    // Devices
    editor.Commands.add('set-device-desktop', { run: (ed) => ed.setDevice('Desktop') });
    editor.Commands.add('set-device-tablet', { run: (ed) => ed.setDevice('Tablet') });
    editor.Commands.add('set-device-mobile', { run: (ed) => ed.setDevice('Mobile') });

    // Export MWD (affiche le JSON)
    editor.Commands.add('export-mwd', {
      run: (ed) => {
        const mwd = exportMWD(ed);
        const text = JSON.stringify(mwd, null, 2);
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(`<pre style="white-space:pre-wrap;">${text}</pre>`);
        } else {
          console.log('MWD:', mwd);
          alert('Export MWD: popup bloquée. Regarde la console.');
        }
      },
    });

    // Save project -> backend -> récupère projectId
    editor.Commands.add('save-project', {
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
          alert(`Projet sauvegardé ✅ (id=${saved.id})`);
        } catch (e: any) {
          alert(`Erreur Save ❌: ${e?.message || e}`);
        }
      },
    });

    // Export Static (nécessite un projectId sauvegardé)
    editor.Commands.add('export-static', {
      run: async () => {
        try {
          const projectId = lastProjectIdRef.current;
          if (!projectId) {
            alert('Tu dois d’abord faire "Save" pour obtenir un projectId.');
            return;
          }

          const result = await exportProject('static', projectId);
          const text = JSON.stringify(result, null, 2);

          const win = window.open('', '_blank');
          if (win) {
            win.document.write(`<pre style="white-space:pre-wrap;">${text}</pre>`);
          } else {
            console.log('Export static:', result);
            alert('Export Static: popup bloquée. Regarde la console.');
          }
        } catch (e: any) {
          alert(`Erreur Export Static ❌: ${e?.message || e}`);
        }
      },
    });

    // Export Shopify (nécessite un projectId sauvegardé)
    editor.Commands.add('export-shopify', {
      run: async () => {
        try {
          const projectId = lastProjectIdRef.current;
          if (!projectId) {
            alert('Tu dois d’abord faire "Save" pour obtenir un projectId.');
            return;
          }

          const result = await exportProject('shopify', projectId);
          const text = JSON.stringify(result, null, 2);

          const win = window.open('', '_blank');
          if (win) {
            win.document.write(`<pre style="white-space:pre-wrap;">${text}</pre>`);
          } else {
            console.log('Export shopify:', result);
            alert('Export Shopify: popup bloquée. Regarde la console.');
          }
        } catch (e: any) {
          alert(`Erreur Export Shopify ❌: ${e?.message || e}`);
        }
      },
    });

    return () => editor.destroy();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Panneaux (GrapesJS attache ses boutons ici) */}
      <div style={{ width: 220, borderRight: '1px solid #ddd', padding: 8 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Devices</div>
        <div className="panel__devices" style={{ marginBottom: 16 }} />

        <div style={{ fontWeight: 600, marginBottom: 8 }}>Actions</div>
        <div className="panel__actions" />
        <hr style={{ margin: '16px 0' }} />
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Blocks</div>
        <div className="blocks-container" />
      </div>

      {/* Canvas GrapesJS */}
      <div ref={editorContainerRef} style={{ flex: 1 }} />
    </div>
  );
};

export default EditorCanvas;
        defaults: [
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [
              {
                id: 'device-desktop',
                label: 'Desktop',
                command: 'set-device-desktop',
                active: true,
              },
              {
                id: 'device-tablet',
                label: 'Tablet',
                command: 'set-device-tablet',
              },
              {
                id: 'device-mobile',
                label: 'Mobile',
                command: 'set-device-mobile',
              },
            ],
          },
          {
            id: 'panel-actions',
            el: '.panel__actions',
            buttons: [
              {
                id: 'export-mwd',
                label: 'Export MWD',
                command: 'export-mwd',
              },
            ],
          },
        ],
      },
    });

    // Commandes devices
    editor.Commands.add('set-device-desktop', {
      run: (ed) => ed.setDevice('Desktop'),
    });
    editor.Commands.add('set-device-tablet', {
      run: (ed) => ed.setDevice('Tablet'),
    });
    editor.Commands.add('set-device-mobile', {
      run: (ed) => ed.setDevice('Mobile'),
    });

    // Commande export MWD (MVP)
    editor.Commands.add('export-mwd', {
      run: (ed) => {
        const mwd = exportMWD(ed);

        // MVP: afficher le JSON dans une nouvelle fenêtre
        const text = JSON.stringify(mwd, null, 2);
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(`<pre style="white-space:pre-wrap;">${text}</pre>`);
        } else {
          // fallback si popup bloquée
          console.log('MWD:', mwd);
          alert('Export MWD: popup bloquée. Regarde la console.');
        }
      },
    });

    return () => editor.destroy();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Colonnes optionnelles pour tes panels (si tu les ajoutes dans ton HTML/CSS plus tard) */}
      <div className="panel__devices" style={{ padding: 8 }} />
      <div className="panel__actions" style={{ padding: 8 }} />

      {/* Canvas GrapesJS */}
      <div ref={editorRef} style={{ flex: 1 }} />
    </div>
  );
};

export default EditorCanvas;
