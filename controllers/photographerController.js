// controllers/photographerController.js
// Member 3: Photographer REST Endpoints

const { getDatabase } = require('../database/db');

// GET /photographers
async function getAllPhotographers(req, res) {
    try {
        const db = await getDatabase();
        const photographers = await db.all('SELECT * FROM photographers ORDER BY id ASC');
        return res.status(200).json(photographers);
    } catch (error) {
        console.error('Error fetching photographers:', error);
        return res.status(500).json({ error: 'Failed to retrieve photographers' });
    }
}

// GET /photographers/:id
async function getPhotographerById(req, res) {
    try {
        const db = await getDatabase();
        const { id } = req.params;
        const photographer = await db.get('SELECT * FROM photographers WHERE id = ?', [id]);

        if (!photographer) {
            return res.status(404).json({ error: `Photographer with ID ${id} not found` });
        }

        return res.status(200).json(photographer);
    } catch (error) {
        console.error('Error fetching photographer:', error);
        return res.status(500).json({ error: 'Failed to retrieve photographer' });
    }
}

// POST /photographers
async function createPhotographer(req, res) {
    try {
        const db = await getDatabase();
        const { name, phone, email } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ error: "Validation failed: 'name' and 'phone' are required." });
        }

        const result = await db.run(
            'INSERT INTO photographers (name, phone, email) VALUES (?, ?, ?)',
            [name.trim(), phone.trim(), email ? email.trim() : null]
        );

        const newPhotographer = await db.get('SELECT * FROM photographers WHERE id = ?', [result.lastID]);

        return res.status(201).json({
            message: 'Photographer registered successfully',
            photographer: newPhotographer
        });
    } catch (error) {
        console.error('Error creating photographer:', error);
        return res.status(500).json({ error: 'Failed to create photographer' });
    }
}

// DELETE /photographers/:id
async function deletePhotographer(req, res) {
    try {
        const db = await getDatabase();
        const { id } = req.params;

        const existing = await db.get('SELECT * FROM photographers WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({ error: `Photographer with ID ${id} not found` });
        }

        await db.run('DELETE FROM photographers WHERE id = ?', [id]);

        return res.status(200).json({
            message: 'Photographer deleted successfully',
            deletedId: parseInt(id, 10)
        });
    } catch (error) {
        console.error('Error deleting photographer:', error);
        return res.status(500).json({ error: 'Failed to delete photographer' });
    }
}

module.exports = {
    getAllPhotographers,
    getPhotographerById,
    createPhotographer,
    deletePhotographer
};
