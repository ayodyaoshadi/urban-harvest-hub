-- Run in MySQL/phpMyAdmin to align events with seed/code (dates to 2026, locations with ", Stafford").
-- Adjust descriptions if your DB has different text.

UPDATE events SET title = 'Sustainable Lifestyle Day', description = 'Join us in planting 100 new trees and discover small changes for a greener daily life.', date = '2026-04-18', time = '09:00', location = 'City Park, Stafford', category = 'lifestyle' WHERE id = 1;
UPDATE events SET title = 'Eco Food Market Day', description = 'Local sustainable food, fresh produce, and organic treats from eco-friendly vendors.', date = '2026-04-22', time = '10:00', location = 'Town Square, Stafford', category = 'food' WHERE id = 2;
UPDATE events SET date = '2026-04-28', time = '08:00', location = 'River Bank, Stafford' WHERE id = 3;
UPDATE events SET title = 'Climate Change Awareness Talk', description = 'Expert talk on climate change impacts and solutions.', date = '2026-05-02', time = '18:00', location = 'Town Hall, Stafford', category = 'education', organizer = 'Climate Action Group' WHERE id = 4;
UPDATE events SET title = 'Bike Repair Workshop', description = 'Learn basic bike maintenance and repair.', date = '2026-05-08', time = '15:00', location = 'Community Center, Stafford', category = 'transport', organizer = 'Cycling Club', is_free = 0, price = 5000 WHERE id = 5;

-- Bike Repair Workshop: paid event – price in LKR (5000 = Rs. 5,000). Change 5000 to your amount if needed.

-- If dates are 2024, you can also just add 2 years:
-- UPDATE events SET date = DATE_ADD(date, INTERVAL 2 YEAR) WHERE YEAR(date) = 2024;
