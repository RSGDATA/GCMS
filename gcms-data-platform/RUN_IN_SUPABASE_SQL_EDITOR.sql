-- ============================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- ============================================================
-- Go to: https://supabase.com/dashboard/project/stttpmepakavlubbsqaq/editor
-- Click "New Query"
-- Copy and paste this ENTIRE file
-- Click "Run" or press Cmd+Enter
-- ============================================================

-- Migration 1: Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Migration 2: Core Foundation Tables
CREATE TABLE IF NOT EXISTS fiscal_year (
    fiscal_year_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CHECK (start_date < end_date)
);

CREATE TABLE IF NOT EXISTS season (
    season_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fiscal_year_id UUID NOT NULL
        REFERENCES fiscal_year(fiscal_year_id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    description TEXT,
    UNIQUE (fiscal_year_id, name)
);

CREATE TABLE IF NOT EXISTS concert (
    concert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season_id UUID NOT NULL
        REFERENCES season(season_id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    program_notes TEXT,
    concert_date DATE NOT NULL,
    venue TEXT,
    total_budget NUMERIC(10,2) CHECK (total_budget >= 0)
);

CREATE INDEX IF NOT EXISTS idx_concert_season ON concert(season_id);
CREATE INDEX IF NOT EXISTS idx_concert_date ON concert(concert_date);

CREATE TABLE IF NOT EXISTS person (
    person_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT NOT NULL
        CHECK (role IN ('musician','conductor','guest','admin'))
);

CREATE INDEX IF NOT EXISTS idx_person_role ON person(role);

CREATE TABLE IF NOT EXISTS musician (
    musician_id UUID PRIMARY KEY
        REFERENCES person(person_id) ON DELETE CASCADE,
    instrument TEXT NOT NULL,
    union_member BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_musician_instrument ON musician(instrument);

CREATE TABLE IF NOT EXISTS user_profile (
   user_id UUID PRIMARY KEY
       REFERENCES auth.users(id) ON DELETE CASCADE,
   person_id UUID NOT NULL
       REFERENCES person(person_id) ON DELETE CASCADE,
   created_at TIMESTAMP DEFAULT NOW(),
   UNIQUE (person_id)
);

-- Migration 3: Music & Rehearsals Tables
CREATE TABLE IF NOT EXISTS piece (
    piece_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    composer TEXT NOT NULL,
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    difficulty_level TEXT CHECK (difficulty_level IN ('easy','medium','hard','advanced'))
);

CREATE TABLE IF NOT EXISTS concert_piece (
    concert_piece_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concert_id UUID NOT NULL
        REFERENCES concert(concert_id) ON DELETE CASCADE,
    piece_id UUID NOT NULL
        REFERENCES piece(piece_id) ON DELETE RESTRICT,
    performance_order INTEGER NOT NULL,
    UNIQUE (concert_id, piece_id),
    UNIQUE (concert_id, performance_order)
);

CREATE TABLE IF NOT EXISTS rehearsal (
    rehearsal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concert_id UUID NOT NULL
        REFERENCES concert(concert_id) ON DELETE CASCADE,
    rehearsal_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location TEXT,
    notes TEXT,
    CHECK (start_time < end_time)
);

CREATE INDEX IF NOT EXISTS idx_rehearsal_concert ON rehearsal(concert_id);
CREATE INDEX IF NOT EXISTS idx_rehearsal_date ON rehearsal(rehearsal_date);

CREATE TABLE IF NOT EXISTS concert_participant (
    participant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concert_id UUID NOT NULL
        REFERENCES concert(concert_id) ON DELETE CASCADE,
    musician_id UUID NOT NULL
        REFERENCES musician(musician_id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('principal','section','substitute')),
    confirmed BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_participant_concert ON concert_participant(concert_id);
CREATE INDEX IF NOT EXISTS idx_participant_musician ON concert_participant(musician_id);

CREATE TABLE IF NOT EXISTS rsvp (
    rsvp_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rehearsal_id UUID NOT NULL
        REFERENCES rehearsal(rehearsal_id) ON DELETE CASCADE,
    musician_id UUID NOT NULL
        REFERENCES musician(musician_id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('yes','no','maybe')),
    response_date TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    UNIQUE (rehearsal_id, musician_id)
);

CREATE INDEX IF NOT EXISTS idx_rsvp_rehearsal ON rsvp(rehearsal_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_musician ON rsvp(musician_id);

CREATE TABLE IF NOT EXISTS attendance (
    attendance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rehearsal_id UUID NOT NULL
        REFERENCES rehearsal(rehearsal_id) ON DELETE CASCADE,
    musician_id UUID NOT NULL
        REFERENCES musician(musician_id) ON DELETE CASCADE,
    attended BOOLEAN NOT NULL,
    minutes_late INTEGER DEFAULT 0 CHECK (minutes_late >= 0),
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (rehearsal_id, musician_id)
);

CREATE INDEX IF NOT EXISTS idx_attendance_rehearsal ON attendance(rehearsal_id);
CREATE INDEX IF NOT EXISTS idx_attendance_musician ON attendance(musician_id);

-- Migration 4: Participation & Payments Tables
CREATE TABLE IF NOT EXISTS payment (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    musician_id UUID NOT NULL
        REFERENCES musician(musician_id) ON DELETE CASCADE,
    concert_id UUID NOT NULL
        REFERENCES concert(concert_id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    payment_date DATE NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('check','direct_deposit','cash','other')),
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_payment_musician ON payment(musician_id);
CREATE INDEX IF NOT EXISTS idx_payment_concert ON payment(concert_id);
CREATE INDEX IF NOT EXISTS idx_payment_date ON payment(payment_date);

CREATE TABLE IF NOT EXISTS contract (
    contract_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    musician_id UUID NOT NULL
        REFERENCES musician(musician_id) ON DELETE CASCADE,
    season_id UUID NOT NULL
        REFERENCES season(season_id) ON DELETE CASCADE,
    contract_type TEXT NOT NULL CHECK (contract_type IN ('per_service','seasonal','annual')),
    rate_per_service NUMERIC(10,2) CHECK (rate_per_service >= 0),
    guaranteed_services INTEGER CHECK (guaranteed_services >= 0),
    start_date DATE NOT NULL,
    end_date DATE,
    notes TEXT,
    CHECK (end_date IS NULL OR start_date < end_date),
    UNIQUE (musician_id, season_id)
);

CREATE INDEX IF NOT EXISTS idx_contract_musician ON contract(musician_id);
CREATE INDEX IF NOT EXISTS idx_contract_season ON contract(season_id);

-- ============================================================
-- SUCCESS!
-- ============================================================
-- If this runs without errors, you now have all 14 tables!
-- Check the "Tables" section in the left sidebar to verify.
-- ============================================================
