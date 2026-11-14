// routes/rentalRoutes.js
// Member 1 (Route Setup) & Member 3 (Join Endpoint)

const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');

// The Join Endpoint: rentals with photographer name and camera name
router.get('/', rentalController.getRentalsWithDetails);
router.get('/details', rentalController.getRentalsWithDetails);

// Create rental endpoint
router.post('/', rentalController.createRental);

module.exports = router;
