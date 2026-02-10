import { getDb, initSchema } from './database.js';

await initSchema();
const db = getDb();

// Prices stored in LKR (e.g. 10000 = Rs. 10,000) – displayed as "Rs. 10,000" in the app
// image_url matches Task 1 items.json so images show when API is used
const workshops = [
  ['Urban Gardening Basics', 'Learn to grow vegetables in small urban spaces.', '2026-04-15', '10:00', 10000, 'gardening', 15, 'Community Garden, Stafford', 'Sarah Green', 'https://picsum.photos/seed/urban-garden/400/300'],
  ['Sustainable Cooking Workshop', 'Cook delicious meals using seasonal, locally-sourced ingredients.', '2026-04-20', '14:00', 12000, 'cooking', 10, 'Community Kitchen, Stafford', 'Chef Marco', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'],
  ['Composting 101', 'Learn how to turn kitchen waste into nutrient-rich compost.', '2026-04-25', '11:00', 8000, 'education', 20, 'Eco Center, Stafford', 'Dr. Earth', 'https://picsum.photos/seed/composting/400/300'],
  ['DIY Solar Panel Installation', 'Learn to install small solar panels for home use.', '2026-05-05', '09:00', 20000, 'energy', 8, 'Tech Hub, Stafford', 'Solar Expert', 'https://picsum.photos/seed/solar/400/300'],
  ['Rainwater Harvesting', 'Set up rainwater collection systems for gardens.', '2026-05-10', '13:00', 14000, 'water', 12, 'Green House, Stafford', 'Water Specialist', 'https://picsum.photos/seed/rainwater/400/300'],
];

// Events match database (titles, descriptions, categories, locations); dates in 2026
const events = [
  ['Sustainable Lifestyle Day', 'Join us in planting 100 new trees and discover small changes for a greener daily life.', '2026-04-18', '09:00', 'City Park, Stafford', 'lifestyle', 'Green City Initiative', 1, 0, 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400'],
  ['Eco Food Market Day', 'Local sustainable food, fresh produce, and organic treats from eco-friendly vendors.', '2026-04-22', '10:00', 'Town Square, Stafford', 'food', 'Sustainable Living Group', 1, 0, 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400'],
  ['River Cleanup Drive', 'Help clean plastic waste from local river banks.', '2026-04-28', '08:00', 'River Bank, Stafford', 'cleanup', 'River Guardians', 1, 0, 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400'],
  ['Climate Change Awareness Talk', 'Expert talk on climate change impacts and solutions.', '2026-05-02', '18:00', 'Town Hall, Stafford', 'education', 'Climate Action Group', 1, 0, 'https://picsum.photos/seed/climate-talk/400/300'],
  ['Bike Repair Workshop', 'Learn basic bike maintenance and repair.', '2026-05-08', '15:00', 'Community Center, Stafford', 'transport', 'Cycling Club', 0, 5000, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400'],
];

// Products match database; prices in LKR (e.g. 5200 = Rs. 5,200); image_url matches items.json
const products = [
  ['Organic Vegetable Seed Pack', 'Assorted organic seeds for home gardening', 5200, 'gardening', 100, null, 'https://picsum.photos/seed/seeds/400/300', 5],
  ['Bamboo Toothbrush Set (4-pack)', 'Eco-friendly bamboo toothbrushes', 6400, 'personal-care', 50, null, 'https://picsum.photos/seed/bamboo/400/300', 4],
  ['Reusable Cotton Shopping Bag', 'Sturdy cotton reusable bag', 3600, 'accessories', 200, null, 'https://picsum.photos/seed/cotton-bag/400/300', 5],
  ['Natural Cleaning Kit', 'Eco-friendly natural cleaning products for the home', 10000, 'home', 30, null, 'https://picsum.photos/seed/cleaning/400/300', 4],
  ['Solar Powered Phone Charger', 'Portable solar charger for phones and devices', 16000, 'electronics', 25, null, 'https://picsum.photos/seed/solar-charger/400/300', 4],
  ['Compostable Phone Case', 'Biodegradable phone case', 8000, 'accessories', 75, null, 'https://picsum.photos/seed/phonecase/400/300', 5],
  ['Organic Cotton T-Shirt', 'Sustainable organic cotton t-shirt', 9200, 'clothing', 60, null, 'https://picsum.photos/seed/tshirt/400/300', 5],
  ['Reusable Beeswax Wraps (3-pack)', 'Eco-friendly food wrap alternative', 7600, 'kitchen', 40, null, 'https://picsum.photos/seed/beeswax/400/300', 5],
];

const insW = `INSERT INTO workshops (title, description, date, time, price, category, max_participants, location, instructor_name, image_url)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
for (const row of workshops) await db.execute(insW, row);

const insE = `INSERT INTO events (title, description, date, time, location, category, organizer, is_free, price, image_url)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
for (const row of events) await db.execute(insE, row);

const insP = `INSERT INTO products (name, description, price, category, stock_quantity, sku, image_url, sustainability_rating)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
for (const row of products) await db.execute(insP, row);

console.log('Seed data inserted.');
