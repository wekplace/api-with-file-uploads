const express = require('express');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

const UserController = require('../controllers/user');

router.post('/signup', UserController.signupUser);

router.post('/login',  UserController.loginUser);

router.delete('/:id', checkAuth, UserController.deleteUser);

module.exports = router;