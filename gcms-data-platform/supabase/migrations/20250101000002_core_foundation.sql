/* ============================================================
   MIGRATION: Core Foundation
   Created: 2025-01-01
   Purpose: Create core business entities
   
   Tables:
   - fiscal_year: Top-level accounting context
   - season: Artistic grouping under fiscal year
   - concert: Core business unit
   - person: Canonical human record
   - musician: Extension table for musicians
   - user_profile: Links Supabase auth to domain model
   ============================================================ */

/* ============================================================
   FISCAL YEAR
   ------------------------------------------------------------ */
CREATE TABLE fiscal_year (
    fiscal_year_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,          -- e.g. "FY 2025"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CHECK (start_date < end_date)
);

COMMENT ON TABLE fiscal_year IS 'Top-level accounting context for financial reporting';
COMMENT ON COLUMN fiscal_year.name IS 'Human-readable fiscal year name (e.g., "FY 2025")';

/* ============================================================
   SEASON
   ------------------------------------------------------------ */
CREATE TABLE season (
    season_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fiscal_year_id UUID NOT NULL
        REFERENCES fiscal_year(fiscal_year_id) ON DELETE RESTRICT,
    name TEXT NOT NULL,                 -- e.g. "2025–2026 Season"
    description TEXT,
    UNIQUE (fiscal_year_id, name)
);

COMMENT ON TABLE season IS 'Artistic grouping of concerts within a fiscal year';
COMMENT ON COLUMN season.name IS 'Season name (e.g., "2025-2026 Season")';

/* ============================================================
   CONCERT
   ------------------------------------------------------------ */
CREATE TABLE concert (
    concert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season_id UUID NOT NULL
        REFERENCES season(season_id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    program_notes TEXT,
    concert_date DATE NOT NULL,
    venue TEXT,
    total_budget NUMERIC(10,2) CHECK (total_budget >= 0)
);

CREATE INDEX idx_concert_season ON concert(season_id);
CREATE INDEX idx_concert_date ON concert(concert_date);

COMMENT ON TABLE concert IS 'Core business unit representing a performance event';
COMMENT ON COLUMN concert.total_budget IS 'Total allocated budget for this concert';

/* ============================================================
   PERSON
   ------------------------------------------------------------ */
CREATE TABLE person (
    person_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT NOT NULL
        CHECK (role IN ('musician','conductor','guest','admin'))
);

CREATE INDEX idx_person_role ON person(role);

COMMENT ON TABLE person IS 'Canonical human record - auth is NOT stored here';
COMMENT ON COLUMN person.role IS 'Primary role: musician, conductor, guest, or admin';

/* ============================================================
   MUSICIAN
   ------------------------------------------------------------ */
CREATE TABLE musician (
    musician_id UUID PRIMARY KEY
        REFERENCES person(person_id) ON DELETE CASCADE,
    instrument TEXT NOT NULL,
    union_member BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_musician_instrument ON musician(instrument);

COMMENT ON TABLE musician IS 'Extension table for musicians with instrument-specific data';
COMMENT ON COLUMN musician.union_member IS 'Whether musician is a union member (affects pay rules)';

/* ============================================================
   USER PROFILE (SUPABASE AUTH LINK)
   ------------------------------------------------------------ */
CREATE TABLE user_profile (
   user_id UUID PRIMARY KEY
       REFERENCES auth.users(id) ON DELETE CASCADE,
   person_id UUID NOT NULL
       REFERENCES person(person_id) ON DELETE CASCADE,
   created_at TIMESTAMP DEFAULT NOW(),
   UNIQUE (person_id)
);

COMMENT ON TABLE user_profile IS 'Links Supabase auth.users to domain model person records';
COMMENT ON COLUMN user_profile.user_id IS 'References auth.users(id) from Supabase Auth';
