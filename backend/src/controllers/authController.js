const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.register = async (req, res) => {
   
    const { fullName, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Email đã tồn tại' });

        user = new User({ fullName, email, password, role, avatarSeed: fullName });
        await user.save(); // Password tự được mã hóa nhờ middleware trong Model

        //Tạo Token trả về ngay sau khi đăng ký
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(res.body);
        
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Sai thông tin đăng nhập' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Sai thông tin đăng nhập' });

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user });
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Lấy thông tin từ token
exports.getInfo = async (req, res) => {
    
    try {
        let user = await User.findById(req.user.id);
        res.status(200).json({user});
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getAllUser= async (req, res) => {
    
    try {
        let users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateAvatar = async (req, res) => {
    try {
       let seed = req.body.seed;
       const user = await User.findById(req.user.id);
       user.avatarSeed = seed;
       await user.save();
       res.sendStatus(204);
    } catch(err) {
        res.status(500).send('Server Error')
    }
}