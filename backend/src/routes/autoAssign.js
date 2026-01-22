const express = require('express');
const router = express.Router();
const autoAssignController = require('../controllers/autoAssignController');
const auth = require('../middleware/auth'); 

const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }
    next();
};

router.post('/run', auth, checkAdmin, autoAssignController.runBatchAssignment);
router.get('/stats', auth, checkAdmin, autoAssignController.getStats);

module.exports = router;