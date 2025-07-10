CREATE EXTENSION  pgcrypto;

CREATE TYPE challenge_category AS ENUM (
  'educational',
  'environmental',
  'sports',
  'creative',
  'social',
  'other'
);
CREATE TYPE challenge_difficulty  AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE submission_status     AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE challenges (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT        NOT NULL,
  description        TEXT,
  image              TEXT,
  points             INTEGER     NOT NULL DEFAULT 0 CHECK (points >= 0),
  category           challenge_category    NOT NULL,
  difficulty         challenge_difficulty  NOT NULL,
  likes_count        INTEGER     NOT NULL DEFAULT 0,
  submissions_count  INTEGER     NOT NULL DEFAULT 0 CHECK (submissions_count >= 0),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proof         TEXT        NOT NULL,
  description   TEXT,
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id  UUID        NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  status        submission_status NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  verified_at   TIMESTAMPTZ
);

CREATE TABLE comments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text              TEXT        NOT NULL CHECK (length(text) > 0),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  parent_comment_id UUID        REFERENCES comments(id) ON DELETE CASCADE,
  user_id           UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id      UUID        NOT NULL REFERENCES challenges(id) ON DELETE CASCADE
);


CREATE TABLE user_stats (
  user_id                    UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  points                     INTEGER NOT NULL DEFAULT 0,
  created_challenges_count   INTEGER NOT NULL DEFAULT 0 CHECK (created_challenges_count  >= 0),
  complete_challenges_count  INTEGER NOT NULL DEFAULT 0 CHECK (complete_challenges_count >= 0),
  active_challenges_count    INTEGER NOT NULL DEFAULT 0 CHECK (active_challenges_count   >= 0),
  saved_challenges_count     INTEGER NOT NULL DEFAULT 0 CHECK (saved_challenges_count    >= 0),
  submissions_count          INTEGER NOT NULL DEFAULT 0 CHECK (submissions_count         >= 0)
);

ALTER TABLE users
  DROP COLUMN IF EXISTS level,
  DROP COLUMN IF EXISTS points;