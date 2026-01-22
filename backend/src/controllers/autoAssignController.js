const munkres = require('../utils/munkres');
const User = require('../models/User');
const Job = require('../models/Job');
const moment = require('moment');

const checkTimeAvailability = (worker, job) => {
    let jobDate;

    if(!job.startTime) return true;


    if (moment(job.startTime, moment.ISO_8601, true).isValid()) {
        jobDate = moment(job.startTime);
    } 
   
    else {
        jobDate = moment(job.startTime, "HH:mm");
    }

    if (!jobDate.isValid()) return false;


    const dayOfWeek = jobDate.day(); 
    
    const slot = worker.availability.find(s => s.dayOfWeek === dayOfWeek);
    
    if (!slot) return false;
    const jobHour = jobDate.hour();
    const jobMinute = jobDate.minute();

    if (jobHour === 0 && jobMinute === 0) {
        return true; 
    }

    const jobTimeStr = jobDate.format("HH:mm");
    return jobTimeStr >= slot.startTime && jobTimeStr <= slot.endTime;
};

exports.runBatchAssignment = async (req, res) => {
    try {
      
        const workers = await User.find({ 
            role: 'worker', 
            currentStatus: 'available'
        });
         
      
        const jobs = await Job.find({ status: 'Open' }).sort({ createdAt: 1 });

        // console.log("Workers found:", workers);
        // console.log("Jobs found:", jobs);

        if (workers.length === 0 || jobs.length === 0) {
            return res.json({ msg: "Không có dữ liệu để ghép." });
        }


        let costMatrix = [];
        const INFINITY = 999999; 
        const BASE_COST = 1000;

        for (let i = 0; i < workers.length; i++) {
            let row = [];
            for (let j = 0; j < jobs.length; j++) {
                const worker = workers[i];
                const job = jobs[j];

                if (!checkTimeAvailability(worker, job)) {
                    row.push(INFINITY);
                    continue;
                }

                const jobWaitHours = moment().diff(moment(job.createdAt), 'hours');
                const workerWaitHours = moment().diff(moment(worker.updatedAt), 'hours');

                let cost = BASE_COST - jobWaitHours - (workerWaitHours * 0.5);

                if (cost < 0) cost = 0;

                row.push(cost);
            }
            costMatrix.push(row);
        }

        const results = munkres.compute(costMatrix);

        let assignments = [];
        
        for (let pair of results) {
            const [workerIdx, jobIdx] = pair;
            const cost = costMatrix[workerIdx][jobIdx];

            if (cost >= INFINITY) continue;

            const assignedWorker = workers[workerIdx];
            const assignedJob = jobs[jobIdx];

            assignedJob.worker = assignedWorker._id;
            assignedJob.status = 'In progress'; 
            await assignedJob.save();

            assignedWorker.currentStatus = 'busy';
            await assignedWorker.save();

            const jobWait = moment().diff(moment(assignedJob.createdAt), 'hours');

            assignments.push({
                worker: assignedWorker.fullName,
                job: assignedJob.title,
                priority_score: (BASE_COST - cost).toFixed(1),
                job_waited: `${jobWait} giờ`
            });
        }

        res.json({
            success: true,
            matches_found: assignments.length,
            details: assignments
        });

    } catch (err) {
        console.error("Lỗi tại runBatchAssignment:", err); 
        res.status(500).send('Server Error');
    }
};

exports.getStats = async (req, res) => {
    try {
        const availableWorkers = await User.countDocuments({ 
            role: 'worker', 
            currentStatus: 'available'
        });
        const openJobs = await Job.countDocuments({ status: 'Open' });
        res.json({
            workers: availableWorkers,
            jobs: openJobs
        }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};