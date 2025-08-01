const express = require('express');
const router = express.Router();

const CartController = require('../controllers/cartController');

router.get('/cart', CartController.showCart);
// router.post('/cart/checkout', CartController.checkout);
router.post('/cart/add/:productId', CartController.addToCart);
router.post('/cart/delete/:productId', CartController.removeFromCart);

module.exports = router