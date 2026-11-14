// routes/cameraRoutes.js
// Member 1 (Route Setup) & Member 3, 4, 5 Integration

const express = require('express');
const router = express.Router();
const cameraController = require('../controllers/cameraController');
const { validateCamera } = require('../middleware/validateCamera');
const { checkDuplicateCamera } = require('../middleware/checkDuplicateCamera');

// GET all cameras (supports ?kind=... and ?search=...)
router.get('/', cameraController.getAllCameras);

// GET single camera by id
router.get('/:id', cameraController.getCameraById);

// POST add camera (with validation & duplicate twist check)
router.post('/', validateCamera, checkDuplicateCamera, cameraController.createCamera);

// PUT update camera (with validation & duplicate twist check)
router.put('/:id', validateCamera, checkDuplicateCamera, cameraController.updateCamera);

// DELETE camera
router.delete('/:id', cameraController.deleteCamera);

module.exports = router;
