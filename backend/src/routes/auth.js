const express = require('express');
const router = express.Router();
const { register, login, getInfo, getAllUser, updateAvatar } = require('../controllers/authController');
const auth = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');


router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getInfo);
router.get('/', auth, checkAdmin, getAllUser); 
router.put('/avatar', auth, updateAvatar)

module.exports = router;