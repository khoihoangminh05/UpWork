const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const { 
    createJob, 
    getNearbyJobs, 
    acceptJob, 
    fireWorker, 
    completeJob, 
    getMyPostedJobs,
    getWorkerHistory, 
    deleteJob,
    updateJob,
    getMyCompletedJobs,
    getWorkerJob,
    getWorkerCompletedJob
} = require('../controllers/jobController');

// api cho khach
router.post('/', auth, createJob); 
router.delete('/:id', auth, deleteJob); 
router.put('/:id', auth, updateJob);
router.get('/client/my-jobs', auth, getMyPostedJobs); 
router.get('/client/my-completedjobs', auth, getMyCompletedJobs); 
router.put('/:id/fire', auth, fireWorker); // huy tho
router.put('/:id/complete', auth, completeJob); // hoan thanh + danh gia

// api cho tho
router.get('/nearby', auth, getNearbyJobs); // tim viec gan day
router.put('/:id/accept', auth, acceptJob); // nhan viec
router.get('/worker/my-jobs', auth, getWorkerJob);
router.get('/worker/my-completedjobs', auth, getWorkerCompletedJob);

// api chung
router.get('/worker/:workerId/history', getWorkerHistory); // Xem review của thợ

module.exports = router;