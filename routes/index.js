var express = require('express');
const verifyToken = require('../middleware/verifyToken');
var router = express.Router();

router.use('/authentication', require("./authentication"))
router.use('/categories', require("./productCategories"))
router.use('/products', require("./products"))
router.use('/inquiries', require("./inquiries"))
router.use(verifyToken)
router.use('/users', require("./users"))

module.exports = router;
