const mongoose = require('mongoose');
const validate = require('mongoose-validator');

mongoose.set('useCreateIndex', true); // for deprecation warning

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique: true ,
        validate: [validate({
            validator: 'isEmail',
            message: 'Not a valid email'
        })]
    },
    password: { type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);