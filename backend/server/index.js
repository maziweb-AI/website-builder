// backend/server/index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { getConverter } = require('../../converters');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test rapide pour vérifier que l’API tourne
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Créer un projet (version MVP sans auth)
app.post('/api/projects', async (req, res) => {
  const { name, template_data, target_platform } = req.body;

  if (!name) return res.status(400).json({ error: 'Missing name' });
  if (!template_data) return res.status(400).json({ error: 'Missing template_data' });

  // MVP: user fixe (plus tard: auth)
  const userId = 1;

  try {
    const result = await pool.query(
      'INSERT INTO projects (name, template_data, target_platform, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, template_data, target_platform || null, userId]
    );
    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Export vers différentes plateformes (MWD v1)
app.post('/api/export/:platform', async (req, res) => {
  const { platform } = req.params;
  const { project } = req.body;

  if (!project) return res.status(400).json({ error: 'Missing project in body' });
  if (!project.template_data) {
    return res.status(400).json({ error: 'Missing project.template_data' });
  }

  try {
    const converter = getConverter(platform);

    if (platform === 'shopify') {
      const files = converter.convertToLiquid(project);
      return res.json({ files });
    }

    if (platform === 'static') {
      const files = converter.convertToStatic(project);
      return res.json({ files });
    }

    return res.status(400).json({ error: 'Unsupported platform' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
const { getConverter } = require('../../converters');

app.post('/api/export/:platform', async (req, res) => {
  const { platform } = req.params;
  const { project } = req.body;

  // MVP: on attend directement l'objet "project" dans le body:
  // { name, template_data }
  try {
    const converter = getConverter(platform);

    if (platform === 'shopify') {
      const files = converter.convertToLiquid(project);
      return res.json({ files });
    }

    if (platform === 'static') {
      const files = converter.convertToStatic(project);
      return res.json({ files });
    }

    return res.status(400).json({ error: 'Unsupported platform' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
