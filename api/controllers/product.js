const mongoose = require('mongoose');
const Product = require('../models/product');
const {resToErr, resToSuccess} = require('../../services/util.service');

module.exports.getProducts = (req, res, next) => {
    Product.find().select('name price _id productImage').exec()
        .then(docs => {
            const responseData = {
                count: docs.length,
                product: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request : {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            resToSuccess(res, responseData, 200);
        })
        .catch(err => {
            console.log(err);
            resToErr(res, err, 500);
        });
}

module.exports.getProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc =>{
            if (doc) {
                resToSuccess(res, {
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }, 200);
            } else {
                resToErr(res, {message: "No valid entry for provided ID"}, 404);
            }
        })
        .catch(err => {
            console.log(err);
            resToErr(res, err, 500);
        });
};

module.exports.createProduct = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then(result => {
        console.log(result);
        resToSuccess(res, {
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        }, 201); // code 201: It means operations successful, resource created
    })
    .catch(err => {
        resToErr(res, err, 500);
    });
};

module.exports.updateProduct = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for ( let ops of req.body ) {
        updateOps[ops.propName] = ops.value;
    }

    Product.updateOne({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        resToSuccess(res, {
            message: 'Product was updated',
            url: 'http://localhost:3000/products/'+id
        }, 200);
    })
    .catch(err => {
        console.log(err);
        resToErr(res, err, 500);
    });
};

module.exports.deleteProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id}).exec()
        .then(result => {
            resToSuccess(res, {
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: { name: 'String', price: 'Number' }
                }
            }, 200);
        })
        .catch(err => {
            resToErr(res, err, 500);
        });
};