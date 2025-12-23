var express = require('express');
const { productsList, productCreate } = require('../controller/products.controller');
const { STATUS_CODE, MESSAGES } = require('../utils/constants');
const validate = require('../middleware/validate');
const productValidations = require('../middleware/validators/productValidations');
var router = express.Router();

router.post("/", async function (req, res, next) {
  try {
    const products = await productsList(req.body)
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: products });
  } catch (error) {
    next(error)
  }
})

router.post("/create", validate(productValidations.create), async function (req, res, next) {
  try {
    const product = await productCreate(req.body)
    res.status(STATUS_CODE.CREATED).json({ msg: MESSAGES.SUCCESS, data: product })
  } catch (error) {
    next(error)
  }
})

router.patch("/", async function (req, res, next) {
  try {
    const product = await productCreate(req.body)
    res.status(STATUS_CODE.CREATED).json({ msg: MESSAGES.SUCCESS, data: product })
  } catch (error) {
    next(error)
  }
})

module.exports = router;