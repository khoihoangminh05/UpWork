const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware xác thực user
const { adminDeposit, getTransactionHistory } = require('../controllers/walletController');
const checkAdmin = require('../middleware/checkAdmin');

// 1. Route Admin nạp tiền (Cần Token + Quyền Admin)
// POST: http://localhost:5000/api/wallet/deposit
router.post('/deposit', auth, checkAdmin, adminDeposit);

// 2. Route User xem lịch sử ví (Chỉ cần Token của chính họ)
// GET: http://localhost:5000/api/wallet/history
router.get('/history', auth, getTransactionHistory);

module.exports = router;