const express = require('express');
const router = express.Router();

const validate = require('../middleware/validate');


const { STATUS_CODE, MESSAGES } = require('../utils/constants');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controller/categories.controller');
const productCategoryValidation = require('../middleware/validators/categoryValidations');

// Get all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: categories });
  } catch (error) {
    next(error);
  }
});

// create a new category
router.post('/', validate(productCategoryValidation.create), async (req, res, next) => {
  try {
    const categories = await createCategory(req.body);
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: categories });
  } catch (error) {
    next(error);
  }
});

// update a category
router.patch('/:id', async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body)
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: category });
  } catch (error) {
    next(error);
  }
})

// delete a category
router.delete('/:id', async (req, res, next) => {
  try {
    const category = await deleteCategory(req.params.id)
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: category });
  } catch (error) {
    next(error);
  }
})
module.exports = router;
