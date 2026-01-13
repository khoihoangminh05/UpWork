const Job = require('../models/Job');
const User = require('../models/User');

exports.createJob = async (req, res) => {
    try {
    
        const { 
            title, 
            description, 
            price, 
            paymentType, 
            address, 
            phone, 
            category,
            startDate,  
            startTime,  
            endTime     
        } = req.body;

        if (!title || !category || !price || !address) {
            return res.status(400).json({ msg: 'Vui lòng điền đủ thông tin bắt buộc' });
        }

        const newJob = new Job({
            client: req.user.id,
            category,
            title, 
            description, 
            price, 
            paymentType,
            address,
            phone,
            startDate,
            startTime,
            endTime
        });

        await newJob.save();
        res.json(newJob);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ msg: "Công việc không tồn tại" });
        }

        if (job.client.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Bạn không có quyền xóa job này" });
        }

        if (job.status !== 'Open') {
            return res.status(400).json({ msg: "Không thể xóa công việc đang thực hiện hoặc đã hoàn thành" });
        }

        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "Đã xóa công việc thành công" });
    
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ msg: "Công việc không tồn tại" });
        }

        if (job.client.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Không có quyền sửa" });
        }

        if (job.status !== 'Open') {
            return res.status(400).json({ msg: "Chỉ có thể sửa khi chưa có ai nhận việc" });
        }

        const { title, description, price, address, phone, startDate, startTime, endTime } = req.body;
        
        if(title) job.title = title;
        if(description) job.description = description;
        if(price) job.price = price;
        if(address) job.address = address;
        if(phone) job.phone = phone;
        if(startDate) job.startDate = startDate;
        if(startTime) job.startTime = startTime;
        if(endTime) job.endTime = endTime;

        await job.save();
        res.json(job); 
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getNearbyJobs = async (req, res) => {
    try {

        const jobs = await Job.find({ status: 'Open' })
            .populate('client', 'fullName avatar')
            .populate('category', 'name image')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.acceptJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Việc không tồn tại' });

        if (job.status !== 'Open') return res.status(400).json({ msg: 'Việc này đã có người khác nhận' });
        
        if (job.client.toString() === req.user.id) return res.status(400).json({ msg: 'Bạn không thể nhận việc của chính mình' });

        const worker = await User.findById(req.user.id);

        if (worker.walletBalance < 50000) return res.status(400).json({ msg: 'Bạn không đủ tiền để nhận việc (Cần 50.000đ)' });
        
        worker.walletBalance -= 50000;
        await worker.save();
        
        job.worker = req.user.id;
        job.status = 'In progress';
        await job.save();

        res.json({ msg: 'Nhận việc thành công', job });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.fireWorker = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.client.toString() !== req.user.id) return res.status(401).json({ msg: 'Không có quyền' });
        
        if (job.status !== 'In progress') return res.status(400).json({ msg: 'Chỉ hủy được khi đang làm' });

        job.worker = null;
        job.status = 'Open'; 
        
        await job.save();
        res.json({ msg: 'Đã hủy thợ, công việc được mở lại cho người khác', job });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.completeJob = async (req, res) => {
    try {
        const { rating, comment } = req.body; 
        const job = await Job.findById(req.params.id).populate('worker');

        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.client.toString() !== req.user.id) return res.status(401).json({ msg: 'Bạn không phải chủ việc này' });
        if (job.status !== 'In progress') return res.status(400).json({ msg: 'Việc chưa được thực hiện' });
        
        job.status = 'Completed';
        job.review = { rating, comment };
        await job.save();

        if (job.worker) {
            const worker = await User.findById(job.worker._id);
            if(worker) {
                const currentTotal = worker.workerStats.totalReviews || 0;
                const currentAvg = worker.workerStats.averageRating || 0;
    
                const newTotal = currentTotal + 1;

                const newAvg = ((currentAvg * currentTotal) + Number(rating)) / newTotal;
    
                worker.workerStats.totalReviews = newTotal;
                worker.workerStats.averageRating = newAvg.toFixed(1); 
                await worker.save();
            }
        }

        res.json({ msg: 'Hoàn thành và đánh giá thành công!', job });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.getMyPostedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ 
            client: req.user.id, 
            status: { $ne: "Completed" } 
        })
        .populate('worker', 'fullName avatar')
        .populate('category', 'name image')
        .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getMyCompletedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ 
            client: req.user.id, 
            status: "Completed"
        })
        .populate('worker', 'fullName avatar')
        .populate('category', 'name image')
        .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getWorkerJob = async (req, res) => {
    try {
        const jobs = await Job.find({ 
            worker: req.user.id,
            status: 'In progress' 
        })
        .populate('client', 'fullName avatar address phone')
        .populate('category', 'name image')
        .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getWorkerCompletedJob = async (req, res) => {
    try {
        const jobs = await Job.find({ 
            worker: req.user.id, 
            status: "Completed"
        })
        .populate('client', 'fullName')
        .populate('category', 'name image')
        .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getWorkerHistory = async (req, res) => {
    try {
        const jobs = await Job.find({ 
            worker: req.params.workerId, 
            status: 'Completed' 
        }).select('title review createdAt');
        res.json(jobs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};