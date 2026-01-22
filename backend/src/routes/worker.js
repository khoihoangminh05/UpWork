const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateProfile } = require('../controllers/workerController.js');

router.put('/profile', auth, updateProfile);

module.exports = router;