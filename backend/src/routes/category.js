const express = require('express');
const { createCategory, getAllCategory, deleteCategory, seedCategories } = require('../controllers/categoryController');
const router = express.Router();

router.post('/', createCategory);
router.get('/', getAllCategory);
router.delete('/:id', deleteCategory);
router.post('/seed', seedCategories);
module.exports = router;