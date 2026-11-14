// controllers/cameraController.js
// Member 3: Basic Camera CRUD Handlers

const { getDatabase } = require('../database/db');

// 1. GET /cameras - Get all cameras
async function getAllCameras(req, res) {
    try {
        const db = await getDatabase();
        const cameras = await db.all('SELECT * FROM cameras ORDER BY id ASC');
        return res.status(200).json(cameras);
    } catch (error) {
        console.error('Error fetching cameras:', error);
        return res.status(500).json({ error: 'Failed to retrieve cameras' });
    }
}

// 2. GET /cameras/:id - Get a single camera by ID
async function getCameraById(req, res) {
    try {
        const db = await getDatabase();
        const { id } = req.params;

        const camera = await db.get('SELECT * FROM cameras WHERE id = ?', [id]);

        if (!camera) {
            return res.status(404).json({ error: `Camera with ID ${id} not found` });
        }

        return res.status(200).json(camera);
    } catch (error) {
        console.error('Error fetching camera:', error);
        return res.status(500).json({ error: 'Failed to retrieve camera' });
    }
}

// 3. POST /cameras - Add a new camera (201 Created)
async function createCamera(req, res) {
    try {
        const db = await getDatabase();
        const { name, kind, status } = req.body;

        const cameraStatus = status || 'available';

        const result = await db.run(
            'INSERT INTO cameras (name, kind, status) VALUES (?, ?, ?)',
            [name, kind, cameraStatus]
        );

        const newCamera = await db.get('SELECT * FROM cameras WHERE id = ?', [result.lastID]);

        return res.status(201).json({
            message: 'Camera created successfully',
            camera: newCamera
        });
    } catch (error) {
        console.error('Error creating camera:', error);
        return res.status(500).json({ error: 'Failed to create camera' });
    }
}

// 4. PUT /cameras/:id - Update an existing camera (200 OK)
async function updateCamera(req, res) {
    try {
        const db = await getDatabase();
        const { id } = req.params;
        const { name, kind, status } = req.body;

        const existing = await db.get('SELECT * FROM cameras WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({ error: `Camera with ID ${id} not found` });
        }

        const updatedStatus = status || existing.status;

        await db.run(
            'UPDATE cameras SET name = ?, kind = ?, status = ? WHERE id = ?',
            [name, kind, updatedStatus, id]
        );

        const updatedCamera = await db.get('SELECT * FROM cameras WHERE id = ?', [id]);

        return res.status(200).json({
            message: 'Camera updated successfully',
            camera: updatedCamera
        });
    } catch (error) {
        console.error('Error updating camera:', error);
        return res.status(500).json({ error: 'Failed to update camera' });
    }
}

// 5. DELETE /cameras/:id - Delete a camera (200 OK)
async function deleteCamera(req, res) {
    try {
        const db = await getDatabase();
        const { id } = req.params;

        const existing = await db.get('SELECT * FROM cameras WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({ error: `Camera with ID ${id} not found` });
        }

        await db.run('DELETE FROM cameras WHERE id = ?', [id]);

        return res.status(200).json({
            message: 'Camera deleted successfully',
            deletedId: parseInt(id, 10)
        });
    } catch (error) {
        console.error('Error deleting camera:', error);
        return res.status(500).json({ error: 'Failed to delete camera' });
    }
}

module.exports = {
    getAllCameras,
    getCameraById,
    createCamera,
    updateCamera,
    deleteCamera
};
