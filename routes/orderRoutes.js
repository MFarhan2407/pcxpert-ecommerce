const OrderController = require('../controllers/orderController');
const express = require('express');
const router = express.Router();

router.post('/checkout', OrderController.checkout);
router.get('/history', OrderController.orderHistory);

module.exports = router