const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ msg: 'Không có token, từ chối truy cập' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Lưu thông tin user vào biến req để dùng sau này
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token không hợp lệ' });
    }
};