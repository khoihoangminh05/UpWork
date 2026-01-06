const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Hàm Admin nạp tiền thủ công cho User
exports.adminDeposit = async (req, res) => {
    // Đầu vào: ID của người được nạp, Số tiền, Lý do
    const { userId, amount, note } = req.body;

    // Validate cơ bản
    // if (!amount || amount <= 0) {
    //     return res.status(400).json({ msg: 'Số tiền nạp phải lớn hơn 0' });
    // }

    try {
        // 1. Tìm User (Worker) cần nạp
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'Không tìm thấy người dùng này' });
        }

        // 2. Cộng tiền vào ví
        // Lưu ý: Mongoose sẽ tự check xem có phải số hay không
        user.walletBalance += parseInt(amount);
        await user.save();

        // 3. Ghi lại lịch sử giao dịch (QUAN TRỌNG)
        // Để sau này biết tại sao ví ông này lại tăng tiền
        await Transaction.create({
            userId: user._id,
            type: 'deposit',
            amount: amount,
            description: note || 'Admin nạp tiền thủ công',
            performedBy: req.user.id // Lấy ID của Admin đang đăng nhập (từ Token)
        });

        res.json({
            msg: 'Nạp tiền thành công!',
            newBalance: user.walletBalance,
            user: {
                id: user._id,
                name: user.fullName,
                email: user.email
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// Hàm xem lịch sử giao dịch của 1 User (Để user xem tiền ra tiền vào)
exports.getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id })
            .sort({ createdAt: -1 }); // Mới nhất lên đầu
        res.json(transactions);
    } catch (err) {
        res.status(500).send('Lỗi Server');
    }
};