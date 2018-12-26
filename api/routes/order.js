const express = require('express');

const OrdersController = require('../controllers/order');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', checkAuth, OrdersController.getOrders);

router.post('/', checkAuth, OrdersController.createOrder);

router.get('/:orderId', checkAuth, OrdersController.getOrder);

router.delete('/:orderId', checkAuth, OrdersController.deleteOrder);

module.exports = router;