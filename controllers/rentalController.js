// controllers/rentalController.js
// Member 3: Rental Operations & Relational JOIN Endpoint

const { getDatabase } = require('../database/db');

// One join endpoint: rentals with the photographer name and the camera name
async function getRentalsWithDetails(req, res) {
    try {
        const db = await getDatabase();

        const query = `
            SELECT
                r.id AS rental_id,
                r.rental_date,
                r.return_date,
                r.status AS rental_status,
                p.id AS photographer_id,
                p.name AS photographer_name,
                p.phone AS photographer_phone,
                c.id AS camera_id,
                c.name AS camera_name,
                c.kind AS camera_kind
            FROM rentals r
            INNER JOIN photographers p ON r.photographer_id = p.id
            INNER JOIN cameras c ON r.camera_id = c.id
            ORDER BY r.id ASC;
        `;

        const rentals = await db.all(query);
        return res.status(200).json(rentals);
    } catch (error) {
        console.error('Error fetching rentals join details:', error);
        return res.status(500).json({ error: 'Failed to retrieve rental records' });
    }
}

// POST /rentals - Create a new rental
async function createRental(req, res) {
    try {
        const db = await getDatabase();
        const { photographer_id, camera_id, rental_date, return_date } = req.body;

        if (!photographer_id || !camera_id || !rental_date) {
            return res.status(400).json({
                error: "Validation failed: 'photographer_id', 'camera_id', and 'rental_date' are required."
            });
        }

        // Check if photographer exists
        const photographer = await db.get('SELECT * FROM photographers WHERE id = ?', [photographer_id]);
        if (!photographer) {
            return res.status(404).json({ error: `Photographer with ID ${photographer_id} not found.` });
        }

        // Check if camera exists
        const camera = await db.get('SELECT * FROM cameras WHERE id = ?', [camera_id]);
        if (!camera) {
            return res.status(404).json({ error: `Camera with ID ${camera_id} not found.` });
        }

        // Check if camera is already rented for this date
        const conflict = await db.get(
            `SELECT * FROM rentals 
             WHERE camera_id = ? AND rental_date = ? AND status = 'active'`,
            [camera_id, rental_date]
        );
        if (conflict) {
            return res.status(409).json({
                error: `Double booking prevented: Camera '${camera.name}' is already reserved for ${rental_date}.`
            });
        }

        const result = await db.run(
            `INSERT INTO rentals (photographer_id, camera_id, rental_date, return_date, status)
             VALUES (?, ?, ?, ?, 'active')`,
            [photographer_id, camera_id, rental_date, return_date || null]
        );

        // Update camera status to 'rented'
        await db.run("UPDATE cameras SET status = 'rented' WHERE id = ?", [camera_id]);

        const newRental = await db.get(
            `SELECT
                r.id AS rental_id,
                r.rental_date,
                r.return_date,
                r.status,
                p.name AS photographer_name,
                c.name AS camera_name
             FROM rentals r
             JOIN photographers p ON r.photographer_id = p.id
             JOIN cameras c ON r.camera_id = c.id
             WHERE r.id = ?`,
            [result.lastID]
        );

        return res.status(201).json({
            message: 'Rental created successfully',
            rental: newRental
        });
    } catch (error) {
        console.error('Error creating rental:', error);
        return res.status(500).json({ error: 'Failed to create rental' });
    }
}

module.exports = {
    getRentalsWithDetails,
    createRental
};
