-- Run this in MySQL/phpMyAdmin to set all workshop dates to 2026 (same year as code/seed).
-- Adjust id ranges if your workshop ids differ.

UPDATE workshops SET date = '2026-04-15' WHERE id = 1;
UPDATE workshops SET date = '2026-04-20' WHERE id = 2;
UPDATE workshops SET date = '2026-04-25' WHERE id = 3;
UPDATE workshops SET date = '2026-05-05' WHERE id = 4;
UPDATE workshops SET date = '2026-05-10' WHERE id = 5;

-- Or update any 2024 date to 2026 in one go:
-- UPDATE workshops SET date = DATE_ADD(date, INTERVAL 2 YEAR) WHERE YEAR(date) = 2024;
