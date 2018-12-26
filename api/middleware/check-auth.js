const jwt = require('jsonwebtoken');
const {resToErr, resToSuccess} = require('../../services/util.service');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch(error) {
        return resToErr(res, {message: 'Auth failed - Token could not be verified'});
    }
}