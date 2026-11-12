// database/seed.js
// Member 2: Database Seeding Script

const { initDb } = require('./db');

async function seed() {
    console.log('--- Initializing and Seeding LensLab Database ---');
    const db = await initDb();

    // Clean up existing data to start fresh
    await db.run('DELETE FROM rentals;');
    await db.run('DELETE FROM cameras;');
    await db.run('DELETE FROM photographers;');
    await db.run('DELETE FROM sqlite_sequence WHERE name IN ("rentals", "cameras", "photographers");');

    // Seed Photographers
    await db.run(
        `INSERT INTO photographers (name, phone, email) VALUES
        ('Rahul Verma', '9876543210', 'rahul.verma@example.com'),
        ('Ananya Sharma', '9123456780', 'ananya.sharma@example.com'),
        ('Vikram Sethi', '9988776655', 'vikram.sethi@example.com');`
    );

    // Seed Cameras (Notice name and kind)
    await db.run(
        `INSERT INTO cameras (name, kind, status) VALUES
        ('Canon EOS R5', 'Mirrorless', 'rented'),
        ('Sony Alpha A7 IV', 'Mirrorless', 'available'),
        ('Nikon D850', 'DSLR', 'available'),
        ('Blackmagic Pocket 6K', 'Cinema', 'available'),
        ('Fujifilm X-T4', 'Mirrorless', 'rented');`
    );

    // Seed Rentals (Linking photographer_id and camera_id)
    await db.run(
        `INSERT INTO rentals (photographer_id, camera_id, rental_date, return_date, status) VALUES
        (1, 1, '2026-11-10', '2026-11-12', 'active'),
        (2, 5, '2026-11-09', '2026-11-14', 'active');`
    );

    console.log('Database successfully seeded with initial cameras, photographers, and rentals!');
}

if (require.main === module) {
    seed().then(() => process.exit(0)).catch((err) => {
        console.error('Seeding error:', err);
        process.exit(1);
    });
}

module.exports = seed;
