-- Additive only. Explicitly applied by npm run db:migrate, never on page load.
ALTER TABLE une_recette.recipes ADD COLUMN IF NOT EXISTS share_token text;
CREATE UNIQUE INDEX IF NOT EXISTS recette_share_token ON une_recette.recipes(share_token) WHERE share_token IS NOT NULL;
