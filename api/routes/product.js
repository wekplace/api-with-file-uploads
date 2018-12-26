const express = require('express');
const multer = require('multer');

const ProductController = require('../controllers/product');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now().toString() +file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg'|| file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        // accept a file
        cb(null, true);
    } else {
        // rejects a file
        cb(null, false);
    }

};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const router = express.Router();

router.get('/', ProductController.getProducts);

router.post('/', checkAuth, upload.single('productImage'), ProductController.createProduct);

router.get('/:productId', ProductController.createProduct);

router.patch('/:productId', checkAuth, ProductController.updateProduct);

router.delete('/:productId', checkAuth, ProductController.deleteProduct);


module.exports = router;