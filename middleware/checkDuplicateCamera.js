// middleware/checkDuplicateCamera.js
// Member 5: Twist Rule Implementation - Case-Insensitive Duplicate Name Check

const { getDatabase } = require('../database/db');

async function checkDuplicateCamera(req, res, next) {
    try {
        const db = await getDatabase();
        const candidateName = req.body.name;
        const currentId = req.params.id ? parseInt(req.params.id, 10) : null;

        let query = 'SELECT * FROM cameras WHERE LOWER(name) = LOWER(?)';
        const params = [candidateName];

        // If updating an existing camera, exclude the current camera's own ID
        if (currentId) {
            query += ' AND id != ?';
            params.push(currentId);
        }

        const existingCamera = await db.get(query, params);

        if (existingCamera) {
            // Twist requirement:
            // "Two cameras cannot share a name, even with different capital letters.
            // A duplicate gets 409 and the message 'Camera 3 already exists'."
            const duplicateName = existingCamera.name || candidateName;
            return res.status(409).json({
                error: `${duplicateName} already exists`,
                message: `${duplicateName} already exists`
            });
        }

        next();
    } catch (error) {
        console.error('Error checking duplicate camera name:', error);
        return res.status(500).json({ error: 'Internal server error checking camera name uniqueness.' });
    }
}

module.exports = { checkDuplicateCamera };
