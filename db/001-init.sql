-- Additive only. Explicitly applied by npm run db:migrate, never on page load.
CREATE SCHEMA IF NOT EXISTS une_recette;
CREATE TABLE IF NOT EXISTS une_recette.users (
  id uuid PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS une_recette.sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES une_recette.users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS recette_session_expiry ON une_recette.sessions(expires_at);
CREATE TABLE IF NOT EXISTS une_recette.recipes (
  owner_id uuid NOT NULL REFERENCES une_recette.users(id) ON DELETE CASCADE,
  id text NOT NULL,
  data jsonb NOT NULL,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(owner_id,id)
);
