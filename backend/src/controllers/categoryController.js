const Category = require('../models/Category');

exports.getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: 1 });
        res.status(200).json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createCategory = async (req, res) => {

    const { name, code, image, basePrice, unit, inputType, hint } = req.body;

    try {
        let category = await Category.findOne({ code });
        if (category) {
            return res.status(400).json({ msg: 'Mã danh mục (code) này đã tồn tại' });
        }

        category = new Category({
            name,
            code,
            image,
            basePrice,
            unit,
            inputType: inputType || 'quantity', 
            hint
        });

        await category.save(); 
        res.status(200).json({ msg: 'Tạo danh mục thành công', category });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        
        if(!deletedCategory) {
            return res.status(404).json({ msg: "Danh mục không tồn tại" });
        }
        
        res.status(200).json({ msg: "Đã xóa danh mục", data: deletedCategory });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.seedCategories = async (req, res) => {
    const services = [
        { 
            name: "Dọn dẹp theo giờ", 
            image: "🧹",
            code: "hourly", 
            basePrice: 80000, 
            unit: "giờ", 
            inputType: "time",
            hint: "80.000 VND/giờ"
        },
        { 
            name: "Tổng vệ sinh (Theo m2)", 
            image: "🏠",
            code: "general_deep", 
            basePrice: 10000, 
            unit: "m2", 
            inputType: "area",
            hint: "100.000 VND/10m2"
        },
        { 
            name: "Giặt ghế Sofa", 
            image: "🛋️",
            code: "sofa", 
            basePrice: 150000, 
            unit: "ghế", 
            inputType: "quantity",
            hint: "150.000 VND/ghế"
        },
        { 
            name: "Giặt Thảm", 
            image: "🧶",
            code: "carpet", 
            basePrice: 20000, 
            unit: "m2", 
            inputType: "area",
            hint: "20.000 VND/1m2"
        },
        { 
            name: "Vệ sinh rèm cửa",
            image: "🪟", 
            code: "curtain", 
            basePrice: 90000, 
            unit: "bộ", 
            inputType: "quantity",
            hint: "80k - 100k VND/bộ"
        },
        { 
            name: "Vệ sinh nệm/đệm", 
            image: "🛏️",
            code: "mattress", 
            basePrice: 250000, 
            unit: "cái", 
            inputType: "quantity",
            hint: "250.000 VND/cái"
        },
        { 
            name: "Vệ sinh bếp sâu", 
            image: "🍳",
            code: "kitchen", 
            basePrice: 300000, 
            unit: "lần", 
            inputType: "fixed",
            hint: "300.000 VND/lần"
        },
        { 
            name: "Vệ sinh nhà tắm sâu", 
            image: "🚽",
            code: "bathroom", 
            basePrice: 250000, 
            unit: "lần", 
            inputType: "fixed",
            hint: "250.000 VND/lần"
        }
    ];

    try {
        await Category.deleteMany({});
        await Category.insertMany(services);
        
        res.json({ msg: "Đã Reset bảng giá dịch vụ thành công!", count: services.length });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};