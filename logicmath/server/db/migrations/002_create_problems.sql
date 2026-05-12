CREATE TABLE IF NOT EXISTS problems (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category      VARCHAR(20) NOT NULL,
  level         SMALLINT NOT NULL CHECK (level BETWEEN 1 AND 5),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  params_json   JSONB NOT NULL,
  answer_json   JSONB NOT NULL,
  steps_json    JSONB NOT NULL,
  xp_reward     SMALLINT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_problems_category_level ON problems(category, level);
