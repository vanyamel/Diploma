CREATE TABLE IF NOT EXISTS attempts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  problem_id   UUID REFERENCES problems(id) ON DELETE CASCADE,
  user_answer  TEXT NOT NULL,
  is_correct   BOOLEAN NOT NULL,
  hints_used   SMALLINT DEFAULT 0,
  time_spent   INTEGER,
  xp_earned    SMALLINT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_user    ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_problem ON attempts(problem_id);
