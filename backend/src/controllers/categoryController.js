const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
   
    const {name, image} = req.body;
    try {
        let category = await Category.findOne({ name });
        if (category) return res.status(400).json({ msg: 'Category đã tồn tại' });

        category = new Category({ name, image });
        await category.save(); 
        res.status(200).json({msg: 'Tạo thành công'});

    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const deleteCategory = await Category.findByIdAndDelete(req.params.id);
        if(!deleteCategory) {
            return res.status(404).json({msg: "Danh mục không tồn tại"});
        }
        res.status(200).json(deleteCategory);

    } catch (err) {
        res.status(500).send('Server Error');
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

exports.getAllCategory = async (req, res) => {
   
    try {
        let categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

