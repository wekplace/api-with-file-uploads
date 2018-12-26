const mongoose = require('mongoose');
const {resToErr, resToSuccess, throwError} = require('../../services/util.service');

const Order = require('../models/order');
const Product = require('../models/product');

module.exports.getOrders =  (req, res, next) => {
    Order.find().populate('product', 'name').exec()
        .then(orders => {
            resToSuccess(res, {
                count: orders.length,
                orders: orders.map(order => {
                    return {
                        _id: order._id,
                        product: order.product,
                        quantity: order.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + order._id
                        }
                    }
                })
            }, 200);
        })
        .catch(err => {
            resToErr(res, err, 500);
        })
}

module.exports.createOrder = (req, res, next) => {
    Product.findById(req.body.productId).exec()
        .then(product => {
            console.log('product - ',product);
            if (product) {
                const order = new Order({
                    _id: new mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: req.body.productId
                });
                return order.save();
            }
            else {
                console.log(product);
                throwError('Cannot find product');
            }
        })
        .then(result => {
            resToSuccess(res, {
                message: 'Order created',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request : {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'+ result._id
                }
            }, 201);
        })
        .catch(err => {
            resToErr(res, err, 500) ;
        });
}

module.exports.getOrder = (req, res, next) => {
    Order.findOne({_id: req.params.orderId}).populate('product', 'name')
    .select('product quantity _id').exec()
    .then(order => {
        if (order) {
            resToSuccess(res, {
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            }, 200);
        } else {
            resToErr(res, { message: 'Order not found'}, 404);
        }
    })
    .catch(err => {
        resToErr(res, err, 500);
    });
}

module.exports.deleteOrder = (req, res, next) => {
    (req, res, next) => {
        const id = req.params.orderId;
        Order.deleteOne({_id: id}).exec()
            .then((result) => {
                resToSuccess(res, {
                    message: 'Order deleted',
                    info: result,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/orders/',
                        body: { productId: 'mongoose.Schema.Types.ObjectId', quantity: 'Number' }
                    }
                })
            })
            .catch(err => {
                resToErr(res, err, 500);
            })
    }
}