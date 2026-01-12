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

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Créer un projet (MVP sans auth)
app.post('/api/projects', async (req, res) => {
  const { name, template_data, target_platform } = req.body;

  if (!name) return res.status(400).json({ error: 'Missing name' });
  if (!template_data) return res.status(400).json({ error: 'Missing template_data' });

  const userId = 1; // TODO: auth plus tard

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

// Récupérer un projet par id
app.get('/api/projects/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid project id' });

  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Export DB-first: on envoie { projectId }
app.post('/api/export/:platform', async (req, res) => {
  const { platform } = req.params;
  const { projectId } = req.body;

  const id = Number(projectId);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Missing or invalid projectId' });

  try {
    // 1) Charger le projet depuis la DB
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

    const project = result.rows[0];

    // 2) Convertir selon la plateforme
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
