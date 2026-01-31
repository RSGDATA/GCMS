-- Add missing concert pieces for Spring Awakening and Season Finale

USE DATABASE GCMS_DEV;
USE SCHEMA MOVEMENT_II_MOVEMENT_II;

-- Spring Awakening: The Four Seasons
INSERT INTO BR_SUPABASE_CONCERT_PIECE (concert_piece_id, concert_id, piece_id, program_order)
SELECT 
    UUID_STRING() as concert_piece_id,
    c.concert_id,
    p.piece_id,
    1 as program_order
FROM BR_SUPABASE_CONCERT c
CROSS JOIN BR_SUPABASE_PIECE p
WHERE c.title = 'Spring Awakening'
  AND p.title = 'The Four Seasons: Spring'
  AND NOT EXISTS (
    SELECT 1 FROM BR_SUPABASE_CONCERT_PIECE cp 
    WHERE cp.concert_id = c.concert_id AND cp.piece_id = p.piece_id
  );

-- Spring Awakening: Mozart 40
INSERT INTO BR_SUPABASE_CONCERT_PIECE (concert_piece_id, concert_id, piece_id, program_order)
SELECT 
    UUID_STRING() as concert_piece_id,
    c.concert_id,
    p.piece_id,
    2 as program_order
FROM BR_SUPABASE_CONCERT c
CROSS JOIN BR_SUPABASE_PIECE p
WHERE c.title = 'Spring Awakening'
  AND p.title = 'Symphony No. 40 in G minor, K. 550'
  AND NOT EXISTS (
    SELECT 1 FROM BR_SUPABASE_CONCERT_PIECE cp 
    WHERE cp.concert_id = c.concert_id AND cp.piece_id = p.piece_id
  );

-- Season Finale: Mahler Titan
INSERT INTO BR_SUPABASE_CONCERT_PIECE (concert_piece_id, concert_id, piece_id, program_order)
SELECT 
    UUID_STRING() as concert_piece_id,
    c.concert_id,
    p.piece_id,
    1 as program_order
FROM BR_SUPABASE_CONCERT c
CROSS JOIN BR_SUPABASE_PIECE p
WHERE c.title = 'Season Finale'
  AND p.title LIKE 'Symphony No. 1 in D major%Titan%'
  AND NOT EXISTS (
    SELECT 1 FROM BR_SUPABASE_CONCERT_PIECE cp 
    WHERE cp.concert_id = c.concert_id AND cp.piece_id = p.piece_id
  );

SELECT 'Concert pieces added!' as status;
SELECT COUNT(*) as total_pieces FROM BR_SUPABASE_CONCERT_PIECE;
