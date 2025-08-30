-- Update test accounts with secure passwords
-- Run this in your Supabase SQL Editor to replace the weak passwords

UPDATE public.musician_auth_simple 
SET password = 'Gc#M5_Cond2024!' 
WHERE username = 'conductor';

UPDATE public.musician_auth_simple 
SET password = 'Cm$Master_9X7!' 
WHERE username = 'concertmaster';

UPDATE public.musician_auth_simple 
SET password = 'Mus1c_P1ay3r#8' 
WHERE username = 'musician1';

UPDATE public.musician_auth_simple 
SET password = 'Adm1n_S3cur3@24' 
WHERE username = 'admin';

-- Verify the updates
SELECT username, password, email FROM public.musician_auth_simple ORDER BY username;
