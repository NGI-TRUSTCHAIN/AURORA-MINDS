-- Fix id sequence (otherwise you will not be able to add through Django)
SELECT setval('adhd_adhd_id_seq', (SELECT MAX(adhd_id) FROM adhd) + 1);