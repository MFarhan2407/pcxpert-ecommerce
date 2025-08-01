const ProductController = require('../controllers/productController');
const express = require('express');
const router = express.Router();

router.get('/home', ProductController.home)
router.get('/products/:id', ProductController.showDetail);

module.exports = router