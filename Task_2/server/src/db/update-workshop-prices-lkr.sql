-- Run this in MySQL/phpMyAdmin to set workshop prices to LKR (same as app display: Rs. 10,000 etc.)
-- Values: 10000, 12000, 8000, 20000, 14000 for workshops 1-5.

UPDATE workshops SET price = 10000 WHERE id = 1;
UPDATE workshops SET price = 12000 WHERE id = 2;
UPDATE workshops SET price = 8000  WHERE id = 3;
UPDATE workshops SET price = 20000 WHERE id = 4;
UPDATE workshops SET price = 14000 WHERE id = 5;
