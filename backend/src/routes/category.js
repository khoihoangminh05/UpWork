const express = require('express');
const { createCategory, getAllCategory, deleteCategory } = require('../controllers/categoryController');
const router = express.Router();

router.post('/', createCategory);
router.get('/', getAllCategory);
router.delete('/:id', deleteCategory);

module.exports = router;