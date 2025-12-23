const { body } = require('express-validator');

const productCategoryValidation = {
  create: [
    body("name").notEmpty().withMessage("Name is required")
  ],
}


module.exports = productCategoryValidation;