const User = require("../models/User");

exports.updateProfile = async (req, res) => {
    try {
        const { skills, availability, currentStatus } = req.body;

        let updateData = {};
        if (skills) updateData.skills = skills;
        if (availability) updateData.availability = availability;
        if (currentStatus) updateData.currentStatus = currentStatus;

        let user = await User.findByIdAndUpdate(
            req.user.id, 
            { $set: updateData }, 
            { new: true } 
        );
        res.json({ msg: "Cập nhật hồ sơ thành công!" });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}