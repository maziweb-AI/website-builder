-- backend/db/schema.sql
-- Schéma minimal pour démarrer (PostgreSQL)

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  template_data JSONB NOT NULL,
  target_platform TEXT,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optionnel (utile): index pour recherches JSON
CREATE INDEX IF NOT EXISTS idx_projects_template_data ON projects USING GIN (template_data);
