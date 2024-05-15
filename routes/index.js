const router = require('express').Router();
const userRoute = require('./users');

/* GET home page. */
router.use('/users', userRoute);

module.exports = router;
