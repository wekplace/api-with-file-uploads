const mongoose = require('mongoose');
const Order = require('../models/order')

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    productImage: {type: String, required: true}
});

productSchema.pre('remove', {query: true, document: false}, (doc) => {
    console.log('Product Schema pre');
    Order.deleteMany({product: doc._id}).exec()
        .then(result => {
            console.log('Orders deleted');
        })
        .catch(err => {
            console.log(err.message);
            
        })
});

module.exports = mongoose.model('Product', productSchema);