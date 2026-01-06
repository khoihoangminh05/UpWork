module.exports = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Bạn không có quyền Admin' });
    }
    next();
};