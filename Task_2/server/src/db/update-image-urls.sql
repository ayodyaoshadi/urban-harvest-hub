-- One-time update: set image_url for workshops, events, products so images show when Task 1 uses the API.
-- Run this if you already have seed data with NULL image_url (e.g. in MySQL Workbench or: mysql -u root -p urban_harvest_hub < update-image-urls.sql).

-- Workshops (by id order from seed)
UPDATE workshops SET image_url = 'https://picsum.photos/seed/urban-garden/400/300' WHERE id = 1;
UPDATE workshops SET image_url = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' WHERE id = 2;
UPDATE workshops SET image_url = 'https://picsum.photos/seed/composting/400/300' WHERE id = 3;
UPDATE workshops SET image_url = 'https://picsum.photos/seed/solar/400/300' WHERE id = 4;
UPDATE workshops SET image_url = 'https://picsum.photos/seed/rainwater/400/300' WHERE id = 5;

-- Events (by id order from seed)
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400' WHERE id = 1;
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400' WHERE id = 2;
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400' WHERE id = 3;
UPDATE events SET image_url = 'https://picsum.photos/seed/climate-talk/400/300' WHERE id = 4;
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400' WHERE id = 5;

-- Products (by id order from seed)
UPDATE products SET image_url = 'https://picsum.photos/seed/seeds/400/300' WHERE id = 1;
UPDATE products SET image_url = 'https://picsum.photos/seed/bamboo/400/300' WHERE id = 2;
UPDATE products SET image_url = 'https://picsum.photos/seed/cotton-bag/400/300' WHERE id = 3;
UPDATE products SET image_url = 'https://picsum.photos/seed/cleaning/400/300' WHERE id = 4;
UPDATE products SET image_url = 'https://picsum.photos/seed/solar-charger/400/300' WHERE id = 5;
UPDATE products SET image_url = 'https://picsum.photos/seed/phonecase/400/300' WHERE id = 6;
UPDATE products SET image_url = 'https://picsum.photos/seed/tshirt/400/300' WHERE id = 7;
UPDATE products SET image_url = 'https://picsum.photos/seed/beeswax/400/300' WHERE id = 8;
