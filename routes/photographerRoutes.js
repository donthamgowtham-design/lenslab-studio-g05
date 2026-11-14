// routes/photographerRoutes.js
// Member 1 (Route Setup) & Member 3

const express = require('express');
const router = express.Router();
const photographerController = require('../controllers/photographerController');

router.get('/', photographerController.getAllPhotographers);
router.get('/:id', photographerController.getPhotographerById);
router.post('/', photographerController.createPhotographer);
router.delete('/:id', photographerController.deletePhotographer);

module.exports = router;
