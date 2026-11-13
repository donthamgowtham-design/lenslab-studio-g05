// routes/cameraRoutes.js
// Member 4: Camera Routes with Validation Middleware

const express = require('express');
const router = express.Router();
const cameraController = require('../controllers/cameraController');
const { validateCamera } = require('../middleware/validateCamera');

// GET all cameras (supports ?kind=... and ?search=...)
router.get('/', cameraController.getAllCameras);

// GET single camera by id
router.get('/:id', cameraController.getCameraById);

// POST add camera (with validation)
router.post('/', validateCamera, cameraController.createCamera);

// PUT update camera (with validation)
router.put('/:id', validateCamera, cameraController.updateCamera);

// DELETE camera
router.delete('/:id', cameraController.deleteCamera);

module.exports = router;
