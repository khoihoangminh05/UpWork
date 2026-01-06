const Job = require('../models/Job');
const User = require('../models/User');


exports.createJob = async (req, res) => {
    try {
        const { title, description, price, paymentType, address, phone, category } = req.body;

        const newJob = new Job({
            client: req.user.id,
            category,
            title, 
            description, 
            price, 
            paymentType,
            address,
            phone
        });

        await newJob.save();
        res.json(newJob);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if(!deletedJob) {
            return res.status(404).json({msg: "Công việc không tồn tại"});
        }
        res.status(200).json(deletedJob);
    
        } catch (err) {
            res.status(500).send('Server Error');
            res.status(500).json({ message: "Lỗi hệ thống" });
        }
};

exports.updateJob = async (req, res) => {
    const {description} = req.body;
    try {
        
        const updatedJob = await Job.findById(req.params.id);
        if(!updatedJob) {
            return res.status(404).json({msg: "Công việc không tồn tại"});
        }
        //console.log(req.body);
        updatedJob.description = description;
        await updatedJob.save();
        res.sendStatus(204);
        
        } catch (err) {
            res.status(500).send('Server Error');
            res.status(500).json({ message: "Lỗi hệ thống" });
        }
};

exports.getNearbyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            status: 'Open',
        }).populate('client', 'fullName avatar').populate('category', 'name image');

        res.json(jobs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.acceptJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Việc không tồn tại' });

        if (job.status !== 'Open') return res.status(400).json({ msg: 'Việc này đã có người khác nhận' });
        const worker = await User.findById(req.user.id);
        if (worker.walletBalance < 50000) return res.status(400).json({ msg: 'Bạn không đủ tiền để nhận' });
        worker.walletBalance -= 50000;
        await worker.save();
        
        job.worker = req.user.id;
        job.status = 'In progress';
        await job.save();

        res.json({ msg: 'Nhận việc thành công', job });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.fireWorker = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
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

//hoan thanh + danh gia
exports.completeJob = async (req, res) => {
    try {
        const { rating, comment } = req.body; 
        console.log(req.body);
        const job = await Job.findById(req.params.id).populate('worker');

        if (job.client.toString() !== req.user.id) return res.status(401).json({ msg: 'Bạn không phải chủ việc này' });
        if (job.status !== 'In progress') return res.status(400).json({ msg: 'Việc chưa được thực hiện' });

        
        job.status = 'Completed';
        job.review = { rating, comment };
        await job.save();

      
        if (job.worker) {
            const worker = await User.findById(job.worker._id);
            const currentTotal = worker.workerStats.totalReviews;
            const currentAvg = worker.workerStats.averageRating;

    
            const newTotal = currentTotal + 1;
            const newAvg = ((currentAvg * currentTotal) + rating) / newTotal;

            worker.workerStats.totalReviews = newTotal;
            worker.workerStats.averageRating = newAvg.toFixed(1); 
            await worker.save();
        }

        res.json({ msg: 'Hoàn thành và đánh giá thành công!', job });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};


exports.getMyPostedJobs = async (req, res) => {
    
    const jobs = await Job.find({ client: req.user.id, status:{$ne:"Completed"} }
    ).populate('worker', 'fullName').populate('category', 'name image').sort({ createdAt: -1 });
    res.json(jobs);
};

exports.getMyCompletedJobs = async (req, res) => {
    
    const jobs = await Job.find({ client: req.user.id , status: "Completed"}
    ).populate('worker', 'fullName').populate('category', 'name image').sort({ createdAt: -1 });
    res.json(jobs);
};

exports.getWorkerJob = async (req, res) => {
    const jobs = await Job.find({ 
        worker: req.user.id,
        status: 'In progress' 
    }).populate('worker', 'fullName').populate('category', 'name image').populate('client', 'fullName').sort({ createdAt: -1 });
    res.json(jobs);
};

exports.getWorkerCompletedJob = async (req, res) => {
    
    const jobs = await Job.find({ worker: req.user.id , status: "Completed"}
    ).populate('worker', 'fullName').populate('category', 'name image').populate('client', 'fullName').sort({ createdAt: -1 });
    res.json(jobs);
};

exports.getWorkerHistory = async (req, res) => {
   
    const jobs = await Job.find({ 
        worker: req.params.workerId, 
        status: 'Completed' 
    }).select('title review createdAt');
    res.json(jobs);
};