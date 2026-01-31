/* ============================================================
   MIGRATION: Participation, Attendance, Payments, Documents
   Created: 2025-01-01
   Purpose: Create participation tracking, payment calculation, and document management
   
   Tables:
   - concert_participant: Contractual and financial anchor
   - rsvp: Intent records (not truth)
   - attendance: Truth records for enforcement and payment
   - payment: Computed, auditable financial records
   - contract: Legal agreements
   - tax_document: Annual tax documents (1099s)
   - media: PDFs, images, videos
   ============================================================ */

/* ============================================================
   CONCERT_PARTICIPANT
   ------------------------------------------------------------ */
CREATE TABLE concert_participant (
    concert_participant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concert_id UUID NOT NULL
        REFERENCES concert(concert_id) ON DELETE CASCADE,
    musician_id UUID NOT NULL
        REFERENCES musician(musician_id) ON DELETE CASCADE,
    role TEXT,                          -- principal, section, soloist
    pay_type TEXT NOT NULL
        CHECK (pay_type IN ('lump_sum','per_service')),
    agreed_amount NUMERIC(10,2) NOT NULL
        CHECK (agreed_amount >= 0),
    UNIQUE (concert_id, musician_id)
);

CREATE INDEX idx_concert_participant_concert
    ON concert_participant(concert_id);
CREATE INDEX idx_concert_participant_musician
    ON concert_participant(musician_id);

COMMENT ON TABLE concert_participant IS 'Defines who is involved in a concert and under what terms - contractual and financial anchor';
COMMENT ON COLUMN concert_participant.pay_type IS 'Payment structure: lump_sum or per_service';
COMMENT ON COLUMN concert_participant.agreed_amount IS 'Total agreed amount (lump_sum) or per-service rate';

/* ============================================================
   RSVP
   ------------------------------------------------------------ */
CREATE TABLE rsvp (
    rsvp_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rehearsal_id UUID
        REFERENCES rehearsal(rehearsal_id) ON DELETE CASCADE,
    concert_id UUID
        REFERENCES concert(concert_id) ON DELETE CASCADE,
    musician_id UUID NOT NULL
        REFERENCES musician(musician_id) ON DELETE CASCADE,
    status TEXT NOT NULL
        CHECK (status IN ('yes','no','tentative')),
    CHECK (
        (rehearsal_id IS NOT NULL AND concert_id IS NULL)
        OR
        (concert_id IS NOT NULL AND rehearsal_id IS NULL)
    )
);

CREATE INDEX idx_rsvp_musician ON rsvp(musician_id);

COMMENT ON TABLE rsvp IS 'Records intent (not truth) - musician can RSVP to either a concert OR a rehearsal';
COMMENT ON COLUMN rsvp.status IS 'RSVP status: yes, no, or tentative';

/* ============================================================
   ATTENDANCE
   ------------------------------------------------------------ */
CREATE TABLE attendance (
    attendance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rehearsal_id UUID
        REFERENCES rehearsal(rehearsal_id) ON DELETE CASCADE,
    concert_id UUID
        REFERENCES concert(concert_id) ON DELETE CASCADE,
    musician_id UUID NOT NULL
        REFERENCES musician(musician_id) ON DELETE CASCADE,
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

CREATE INDEX idx_attendance_musician
    ON attendance(musician_id);

COMMENT ON TABLE attendance IS 'Records truth - used for enforcement and payment calculations';
COMMENT ON COLUMN attendance.attended IS 'Whether musician actually attended';
COMMENT ON COLUMN attendance.check_in_time IS 'Timestamp of check-in (if tracked)';

/* ============================================================
   PAYMENT
   ------------------------------------------------------------ */
CREATE TABLE payment (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concert_id UUID NOT NULL
        REFERENCES concert(concert_id) ON DELETE RESTRICT,
    musician_id UUID NOT NULL
        REFERENCES musician(musician_id) ON DELETE RESTRICT,
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

CREATE INDEX idx_payment_concert
    ON payment(concert_id);
CREATE INDEX idx_payment_musician
    ON payment(musician_id);

COMMENT ON TABLE payment IS 'Computed, auditable financial record - never overwrite, insert new rows if recalculated';
COMMENT ON COLUMN payment.gross_amount IS 'Total amount before deductions';
COMMENT ON COLUMN payment.deductions IS 'Amount deducted (e.g., for missed required services)';
COMMENT ON COLUMN payment.net_amount IS 'Final amount to be paid (gross - deductions)';

/* ============================================================
   CONTRACT
   ------------------------------------------------------------ */
CREATE TABLE contract (
    contract_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concert_id UUID NOT NULL
        REFERENCES concert(concert_id) ON DELETE CASCADE,
    musician_id UUID NOT NULL
        REFERENCES musician(musician_id) ON DELETE CASCADE,
    signed_date DATE,
    file_url TEXT NOT NULL,
    UNIQUE (concert_id, musician_id)
);

COMMENT ON TABLE contract IS 'Legal agreement for a musician on a concert';
COMMENT ON COLUMN contract.file_url IS 'URL to contract document (e.g., Supabase Storage)';

/* ============================================================
   TAX DOCUMENT
   ------------------------------------------------------------ */
CREATE TABLE tax_document (
    tax_document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    musician_id UUID NOT NULL
        REFERENCES musician(musician_id) ON DELETE CASCADE,
    tax_year INTEGER NOT NULL
        CHECK (tax_year >= 2000),
    document_type TEXT NOT NULL
        CHECK (document_type = '1099'),
    file_url TEXT NOT NULL,
    UNIQUE (musician_id, tax_year, document_type)
);

COMMENT ON TABLE tax_document IS 'Annual tax documents (e.g., 1099s)';
COMMENT ON COLUMN tax_document.tax_year IS 'Tax year for this document';
COMMENT ON COLUMN tax_document.file_url IS 'URL to tax document (e.g., Supabase Storage)';

/* ============================================================
   MEDIA
   ------------------------------------------------------------ */
CREATE TABLE media (
    media_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concert_id UUID
        REFERENCES concert(concert_id) ON DELETE CASCADE,
    piece_id UUID
        REFERENCES piece(piece_id) ON DELETE CASCADE,
    file_type TEXT NOT NULL
        CHECK (file_type IN ('pdf','image','video')),
    file_url TEXT NOT NULL,
    description TEXT
);

CREATE INDEX idx_media_concert ON media(concert_id);
CREATE INDEX idx_media_piece ON media(piece_id);

COMMENT ON TABLE media IS 'PDFs, images, and videos - can be attached to concerts or specific pieces';
COMMENT ON COLUMN media.file_type IS 'Type of media: pdf, image, or video';
COMMENT ON COLUMN media.file_url IS 'URL to media file (e.g., Supabase Storage)';
