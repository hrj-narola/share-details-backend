const { body } = require('express-validator');

const productValidations = {
  create: [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").notEmpty().withMessage("Price is required").isNumeric().withMessage("Price should be in number"),
    body("categoryId").notEmpty().withMessage("CategoryId is required"),
    body("stock").notEmpty().withMessage("Please add stock for the new product"),
  ],
}


module.exports = productValidations;