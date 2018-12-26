const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const pe = require('parse-error');

const {resToErr, resToSuccess} = require('./services/util.service');

const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');

// DATABASE
// mongoose.connect(`mongodb://user:${process.env.MONGO_ATLAS_PW}@node-rest-api-shard-00-00-tybel.mongodb.net:27017,node-rest-api-shard-00-01-tybel.mongodb.net:27017,node-rest-api-shard-00-02-tybel.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-api-shard-0&authSource=admin&retryWrites=true`, { useNewUrlParser: true})
mongoose.connect(`mongodb://localhost:27017/groupyChat`, { useNewUrlParser: true})
.catch((err) => {
    console.log('*** Can Not Connect to Mongo Server');
});
let db = mongoose.connection;
db.once('open', ()=>{
    console.log('Connected to mongo at DB');
})
db.on('error', (error)=>{
    console.log("error", error);
});

app.use(morgan('dev'));
app.use('/upload', express.static('upload'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// handling CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return resToSuccess(res, {}, 200);
    }
    next();
});

// router middleware
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);


// handling errors - any route operation that makes it pass the above routes is definitely an error.

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    resToErr(res, error, error.status || 500);
});

module.exports = app;

process.on('unhandledRejection', error => {
    console.error('Uncaught Error', pe(error));
})
.on('uncaughtException', err => {
  console.error(err, 'Uncaught Exception thrown');
  process.exit(1);
});