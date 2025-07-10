CREATE TYPE connection_type AS ENUM (
  'author',
  'active',
  'complete',
  'saved',
  'pending_verification',
  'awaiting_response'
);

CREATE TABLE user_challenge_connection (
  user_id       UUID            NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
  challenge_id  UUID            NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  type connection_type NOT NULL,
  ts TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id, challenge_id, type)
);

CREATE INDEX idx_ucc_user_type ON user_challenge_connection (user_id, type);