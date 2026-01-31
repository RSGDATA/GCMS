-- ============================================================
-- CLEAN SLATE SCRIPT 2: CREATE ALL TABLES
-- ============================================================
-- 
-- PURPOSE: Create all GCMS tables with correct schema for dbt
-- 
-- SCHEMA VERIFIED AGAINST:
-- ✅ dbt sources.yml
-- ✅ dbt Bronze models (br_supabase_*)
-- ✅ dbt Silver models (stg_*, int_*)
-- ✅ dbt Gold models (fct_*, dim_*)
-- ✅ Python loading script
-- ✅ Airflow DAG
--
-- USAGE:
-- 1. Run Script 1 (DROP ALL) first
-- 2. Open Supabase SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run" or press Cmd+Enter
--
-- ============================================================

BEGIN;

-- ============================================================
-- CORE FOUNDATION TABLES
-- ============================================================

-- ------------------------------------------------------------
-- FISCAL YEAR
-- ------------------------------------------------------------
CREATE TABLE public.fiscal_year (
    fiscal_year_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CHECK (start_date < end_date)
);

COMMENT ON TABLE public.fiscal_year IS 'Top-level accounting context for financial reporting';
COMMENT ON COLUMN public.fiscal_year.name IS 'Human-readable fiscal year name (e.g., "FY 2025")';

-- ------------------------------------------------------------
-- SEASON
-- ------------------------------------------------------------
CREATE TABLE public.season (
    season_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    fiscal_year_id UUID NOT NULL
        REFERENCES public.fiscal_year(fiscal_year_id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    description TEXT,
    UNIQUE (fiscal_year_id, name)
);

COMMENT ON TABLE public.season IS 'Artistic grouping of concerts within a fiscal year';
COMMENT ON COLUMN public.season.name IS 'Season name (e.g., "2025-2026 Season")';

CREATE INDEX idx_season_fiscal_year ON public.season(fiscal_year_id);

-- ------------------------------------------------------------
-- CONCERT
-- ------------------------------------------------------------
CREATE TABLE public.concert (
    concert_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    season_id UUID NOT NULL
        REFERENCES public.season(season_id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    program_notes TEXT,
    concert_date DATE NOT NULL,
    venue TEXT,
    total_budget NUMERIC(10,2) CHECK (total_budget >= 0)
);

COMMENT ON TABLE public.concert IS 'Core business unit representing a performance event';
COMMENT ON COLUMN public.concert.total_budget IS 'Total allocated budget for this concert';

CREATE INDEX idx_concert_season ON public.concert(season_id);
CREATE INDEX idx_concert_date ON public.concert(concert_date);

-- ------------------------------------------------------------
-- PERSON
-- ------------------------------------------------------------
CREATE TABLE public.person (
    person_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT NOT NULL
        CHECK (role IN ('musician','conductor','guest','admin'))
);

COMMENT ON TABLE public.person IS 'Canonical human record - auth is NOT stored here';
COMMENT ON COLUMN public.person.role IS 'Primary role: musician, conductor, guest, or admin';

CREATE INDEX idx_person_role ON public.person(role);
CREATE INDEX idx_person_email ON public.person(email);

-- ------------------------------------------------------------
-- MUSICIAN
-- ------------------------------------------------------------
CREATE TABLE public.musician (
    musician_id UUID PRIMARY KEY
        REFERENCES public.person(person_id) ON DELETE CASCADE,
    instrument TEXT NOT NULL,
    union_member BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE public.musician IS 'Extension table for musicians with instrument-specific data';
COMMENT ON COLUMN public.musician.union_member IS 'Whether musician is a union member (affects pay rules)';

CREATE INDEX idx_musician_instrument ON public.musician(instrument);

-- ------------------------------------------------------------
-- USER PROFILE (SUPABASE AUTH LINK)
-- ------------------------------------------------------------
CREATE TABLE public.user_profile (
   user_id UUID PRIMARY KEY
       REFERENCES auth.users(id) ON DELETE CASCADE,
   person_id UUID NOT NULL
       REFERENCES public.person(person_id) ON DELETE CASCADE,
   created_at TIMESTAMP DEFAULT NOW(),
   UNIQUE (person_id)
);

COMMENT ON TABLE public.user_profile IS 'Links Supabase auth.users to domain model person records';
COMMENT ON COLUMN public.user_profile.user_id IS 'References auth.users(id) from Supabase Auth';

-- ============================================================
-- MUSIC & REHEARSALS TABLES
-- ============================================================

-- ------------------------------------------------------------
-- PIECE (REPERTOIRE)
-- ------------------------------------------------------------
CREATE TABLE public.piece (
    piece_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title TEXT NOT NULL,
    composer TEXT,
    duration_minutes INTEGER CHECK (duration_minutes > 0)
);

COMMENT ON TABLE public.piece IS 'Canonical list of musical works - reused across concerts and seasons';
COMMENT ON COLUMN public.piece.duration_minutes IS 'Approximate performance duration in minutes';

CREATE INDEX idx_piece_composer ON public.piece(composer);
CREATE INDEX idx_piece_title ON public.piece(title);

-- ------------------------------------------------------------
-- CONCERT_PIECE
-- ------------------------------------------------------------
CREATE TABLE public.concert_piece (
    concert_piece_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    concert_id UUID NOT NULL
        REFERENCES public.concert(concert_id) ON DELETE CASCADE,
    piece_id UUID NOT NULL
        REFERENCES public.piece(piece_id) ON DELETE RESTRICT,
    program_order INTEGER CHECK (program_order > 0),
    UNIQUE (concert_id, piece_id)
);

COMMENT ON TABLE public.concert_piece IS 'Join table defining which pieces are played on a concert and in what order';
COMMENT ON COLUMN public.concert_piece.program_order IS 'Order in which piece appears in concert program';

CREATE INDEX idx_concert_piece_concert ON public.concert_piece(concert_id);
CREATE INDEX idx_concert_piece_piece ON public.concert_piece(piece_id);

-- ------------------------------------------------------------
-- REHEARSAL
-- ------------------------------------------------------------
CREATE TABLE public.rehearsal (
    rehearsal_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    concert_id UUID NOT NULL
        REFERENCES public.concert(concert_id) ON DELETE CASCADE,
    rehearsal_date TIMESTAMP NOT NULL,
    location TEXT,
    required BOOLEAN DEFAULT TRUE,
    service_value NUMERIC(8,2) CHECK (service_value >= 0)
);

COMMENT ON TABLE public.rehearsal IS 'Rehearsal events - child of concert, represents a paid or unpaid service';
COMMENT ON COLUMN public.rehearsal.required IS 'Whether attendance is required for payment calculation';
COMMENT ON COLUMN public.rehearsal.service_value IS 'Value of this service for per-service payment calculations';

CREATE INDEX idx_rehearsal_concert ON public.rehearsal(concert_id);
CREATE INDEX idx_rehearsal_date ON public.rehearsal(rehearsal_date);

-- ============================================================
-- PARTICIPATION, ATTENDANCE & PAYMENTS TABLES
-- ============================================================

-- ------------------------------------------------------------
-- CONCERT_PARTICIPANT
-- ------------------------------------------------------------
CREATE TABLE public.concert_participant (
    concert_participant_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    concert_id UUID NOT NULL
        REFERENCES public.concert(concert_id) ON DELETE CASCADE,
    musician_id UUID NOT NULL
        REFERENCES public.musician(musician_id) ON DELETE CASCADE,
    role TEXT,
    pay_type TEXT NOT NULL
        CHECK (pay_type IN ('lump_sum','per_service')),
    agreed_amount NUMERIC(10,2) NOT NULL
        CHECK (agreed_amount >= 0),
    UNIQUE (concert_id, musician_id)
);

COMMENT ON TABLE public.concert_participant IS 'Defines who is involved in a concert and under what terms - contractual and financial anchor';
COMMENT ON COLUMN public.concert_participant.pay_type IS 'Payment structure: lump_sum or per_service';
COMMENT ON COLUMN public.concert_participant.agreed_amount IS 'Total agreed amount (lump_sum) or per-service rate';

CREATE INDEX idx_concert_participant_concert ON public.concert_participant(concert_id);
CREATE INDEX idx_concert_participant_musician ON public.concert_participant(musician_id);

-- ------------------------------------------------------------
-- RSVP
-- ------------------------------------------------------------
CREATE TABLE public.rsvp (
    rsvp_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    rehearsal_id UUID
        REFERENCES public.rehearsal(rehearsal_id) ON DELETE CASCADE,
    concert_id UUID
        REFERENCES public.concert(concert_id) ON DELETE CASCADE,
    musician_id UUID NOT NULL
        REFERENCES public.musician(musician_id) ON DELETE CASCADE,
    status TEXT NOT NULL
        CHECK (status IN ('yes','no','tentative')),
    CHECK (
        (rehearsal_id IS NOT NULL AND concert_id IS NULL)
        OR
        (concert_id IS NOT NULL AND rehearsal_id IS NULL)
    )
);

COMMENT ON TABLE public.rsvp IS 'Records intent (not truth) - musician can RSVP to either a concert OR a rehearsal';
COMMENT ON COLUMN public.rsvp.status IS 'RSVP status: yes, no, or tentative';

CREATE INDEX idx_rsvp_musician ON public.rsvp(musician_id);
CREATE INDEX idx_rsvp_rehearsal ON public.rsvp(rehearsal_id);
CREATE INDEX idx_rsvp_concert ON public.rsvp(concert_id);

-- ------------------------------------------------------------
-- ATTENDANCE
-- ------------------------------------------------------------
CREATE TABLE public.attendance (
    attendance_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    rehearsal_id UUID
        REFERENCES public.rehearsal(rehearsal_id) ON DELETE CASCADE,
    concert_id UUID
        REFERENCES public.concert(concert_id) ON DELETE CASCADE,
    musician_id UUID NOT NULL
        REFERENCES public.musician(musician_id) ON DELETE CASCADE,
    attended BOOLEAN NOT NULL,
    check_in_time TIMESTAMP,
    CHECK (
        (rehearsal_id IS NOT NULL AND concert_id IS NULL)
        OR
        (concert_id IS NOT NULL AND rehearsal_id IS NULL)
    ),
    UNIQUE (rehearsal_id, musician_id),
    UNIQUE (concert_id, musician_id)
);

COMMENT ON TABLE public.attendance IS 'Records truth - used for enforcement and payment calculations';
COMMENT ON COLUMN public.attendance.attended IS 'Whether musician actually attended';
COMMENT ON COLUMN public.attendance.check_in_time IS 'Timestamp of check-in (if tracked)';

CREATE INDEX idx_attendance_musician ON public.attendance(musician_id);
CREATE INDEX idx_attendance_rehearsal ON public.attendance(rehearsal_id);
CREATE INDEX idx_attendance_concert ON public.attendance(concert_id);

-- ------------------------------------------------------------
-- PAYMENT
-- ------------------------------------------------------------
CREATE TABLE public.payment (
    payment_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    concert_id UUID NOT NULL
        REFERENCES public.concert(concert_id) ON DELETE RESTRICT,
    musician_id UUID NOT NULL
        REFERENCES public.musician(musician_id) ON DELETE RESTRICT,
    gross_amount NUMERIC(10,2) NOT NULL
        CHECK (gross_amount >= 0),
    deductions NUMERIC(10,2) NOT NULL
        CHECK (deductions >= 0),
    net_amount NUMERIC(10,2) NOT NULL
        CHECK (net_amount >= 0),
    paid BOOLEAN DEFAULT FALSE,
    payment_date DATE,
    CHECK (net_amount = gross_amount - deductions)
);

COMMENT ON TABLE public.payment IS 'Computed, auditable financial record - never overwrite, insert new rows if recalculated';
COMMENT ON COLUMN public.payment.gross_amount IS 'Total amount before deductions';
COMMENT ON COLUMN public.payment.deductions IS 'Amount deducted (e.g., for missed required services)';
COMMENT ON COLUMN public.payment.net_amount IS 'Final amount to be paid (gross - deductions)';

CREATE INDEX idx_payment_concert ON public.payment(concert_id);
CREATE INDEX idx_payment_musician ON public.payment(musician_id);

-- ------------------------------------------------------------
-- CONTRACT
-- ------------------------------------------------------------
CREATE TABLE public.contract (
    contract_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    concert_id UUID NOT NULL
        REFERENCES public.concert(concert_id) ON DELETE CASCADE,
    musician_id UUID NOT NULL
        REFERENCES public.musician(musician_id) ON DELETE CASCADE,
    signed_date DATE,
    file_url TEXT NOT NULL,
    UNIQUE (concert_id, musician_id)
);

COMMENT ON TABLE public.contract IS 'Legal agreement for a musician on a concert';
COMMENT ON COLUMN public.contract.file_url IS 'URL to contract document (e.g., Supabase Storage)';

CREATE INDEX idx_contract_concert ON public.contract(concert_id);
CREATE INDEX idx_contract_musician ON public.contract(musician_id);

-- ------------------------------------------------------------
-- TAX DOCUMENT
-- ------------------------------------------------------------
CREATE TABLE public.tax_document (
    tax_document_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    musician_id UUID NOT NULL
        REFERENCES public.musician(musician_id) ON DELETE CASCADE,
    tax_year INTEGER NOT NULL
        CHECK (tax_year >= 2000),
    document_type TEXT NOT NULL
        CHECK (document_type = '1099'),
    file_url TEXT NOT NULL,
    UNIQUE (musician_id, tax_year, document_type)
);

COMMENT ON TABLE public.tax_document IS 'Annual tax documents (e.g., 1099s)';
COMMENT ON COLUMN public.tax_document.tax_year IS 'Tax year for this document';
COMMENT ON COLUMN public.tax_document.file_url IS 'URL to tax document (e.g., Supabase Storage)';

CREATE INDEX idx_tax_document_musician ON public.tax_document(musician_id);

-- ------------------------------------------------------------
-- MEDIA
-- ------------------------------------------------------------
CREATE TABLE public.media (
    media_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    concert_id UUID
        REFERENCES public.concert(concert_id) ON DELETE CASCADE,
    piece_id UUID
        REFERENCES public.piece(piece_id) ON DELETE CASCADE,
    file_type TEXT NOT NULL
        CHECK (file_type IN ('pdf','image','video')),
    file_url TEXT NOT NULL,
    description TEXT
);

COMMENT ON TABLE public.media IS 'PDFs, images, and videos - can be attached to concerts or specific pieces';
COMMENT ON COLUMN public.media.file_type IS 'Type of media: pdf, image, or video';
COMMENT ON COLUMN public.media.file_url IS 'URL to media file (e.g., Supabase Storage)';

CREATE INDEX idx_media_concert ON public.media(concert_id);
CREATE INDEX idx_media_piece ON public.media(piece_id);

COMMIT;

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Check that all tables were created
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'fiscal_year', 'season', 'concert', 'person', 'musician', 
    'user_profile', 'piece', 'concert_piece', 'rehearsal',
    'concert_participant', 'rsvp', 'attendance', 'payment',
    'contract', 'tax_document', 'media'
  )
ORDER BY table_name;

-- Should return 16 rows (all tables created)

-- ============================================================
-- SUCCESS!
-- ============================================================
-- All GCMS tables have been created with correct schema.
-- Ready to run Script 3: INSERT SAMPLE DATA
-- ============================================================
