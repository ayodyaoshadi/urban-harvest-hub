-- Run in MySQL/phpMyAdmin to set product prices to LKR (matches app display).
-- Optional: set image_url so product images show when using API.

UPDATE products SET price = 5200 WHERE id = 1;
UPDATE products SET price = 6400 WHERE id = 2;
UPDATE products SET price = 3600 WHERE id = 3;
UPDATE products SET price = 10000 WHERE id = 4;
UPDATE products SET price = 16000 WHERE id = 5;
UPDATE products SET price = 8000 WHERE id = 6;
UPDATE products SET price = 9200 WHERE id = 7;
UPDATE products SET price = 7600 WHERE id = 8;

-- Optional: add image URLs so product images display (replace with your URLs if preferred)
-- UPDATE products SET image_url = 'https://picsum.photos/seed/seeds/400/300' WHERE id = 1;
-- UPDATE products SET image_url = 'https://picsum.photos/seed/bamboo/400/300' WHERE id = 2;
-- ... etc for ids 3-8
