/* ============================================================
   MIGRATION: Music & Rehearsals
   Created: 2025-01-01
   Purpose: Create music repertoire and rehearsal tracking
   
   Tables:
   - piece: Canonical list of musical works
   - concert_piece: Join table for concert programs
   - rehearsal: Rehearsal events for concerts
   ============================================================ */

/* ============================================================
   PIECE (REPERTOIRE)
   ------------------------------------------------------------ */
CREATE TABLE piece (
    piece_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    composer TEXT,
    duration_minutes INTEGER CHECK (duration_minutes > 0)
);

CREATE INDEX idx_piece_composer ON piece(composer);
CREATE INDEX idx_piece_title ON piece(title);

COMMENT ON TABLE piece IS 'Canonical list of musical works - reused across concerts and seasons';
COMMENT ON COLUMN piece.duration_minutes IS 'Approximate performance duration in minutes';

/* ============================================================
   CONCERT_PIECE
   ------------------------------------------------------------ */
CREATE TABLE concert_piece (
    concert_piece_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concert_id UUID NOT NULL
        REFERENCES concert(concert_id) ON DELETE CASCADE,
    piece_id UUID NOT NULL
        REFERENCES piece(piece_id) ON DELETE RESTRICT,
    program_order INTEGER CHECK (program_order > 0),
    UNIQUE (concert_id, piece_id)
);

CREATE INDEX idx_concert_piece_concert ON concert_piece(concert_id);
CREATE INDEX idx_concert_piece_piece ON concert_piece(piece_id);

COMMENT ON TABLE concert_piece IS 'Join table defining which pieces are played on a concert and in what order';
COMMENT ON COLUMN concert_piece.program_order IS 'Order in which piece appears in concert program';

/* ============================================================
   REHEARSAL
   ------------------------------------------------------------ */
CREATE TABLE rehearsal (
    rehearsal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concert_id UUID NOT NULL
        REFERENCES concert(concert_id) ON DELETE CASCADE,
    rehearsal_date TIMESTAMP NOT NULL,
    location TEXT,
    required BOOLEAN DEFAULT TRUE,
    service_value NUMERIC(8,2) CHECK (service_value >= 0)
);

CREATE INDEX idx_rehearsal_concert ON rehearsal(concert_id);
CREATE INDEX idx_rehearsal_date ON rehearsal(rehearsal_date);

COMMENT ON TABLE rehearsal IS 'Rehearsal events - child of concert, represents a paid or unpaid service';
COMMENT ON COLUMN rehearsal.required IS 'Whether attendance is required for payment calculation';
COMMENT ON COLUMN rehearsal.service_value IS 'Value of this service for per-service payment calculations';
