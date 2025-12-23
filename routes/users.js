const express = require('express');
const router = express.Router();

const validate = require('../middleware/validate');
const userValidation = require('../middleware/validators/userValidations');
const {
  getAllUsers,
  getByIdUsers,
  updateByIdUsers,
  deleteByIdUsers,
  userChangePassword,
} = require('../controller/user.controller');

const { STATUS_CODE, MESSAGES } = require('../utils/constants');

// Get all users
router.get('/', async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: users });
  } catch (error) {
    next(error);
  }
});

// GET USER PROFILE USING TOKEN
router.get("/profile-me", async function (req, res, next) {
  try {
    const user = await getByIdUsers(req.user.id);
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: user });
  } catch (error) {
    next(error)
  }
})

// Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const user = await getByIdUsers(req.params.id);
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: user });
  } catch (error) {
    next(error);
  }
});

// Update user
router.patch('/:id', validate(userValidation.update), async (req, res, next) => {
  try {
    const updatedUser = await updateByIdUsers(req.params.id, req.body);
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.USER_UPDATED_SUCCESS, data: updatedUser });
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete('/:id', validate(userValidation.delete), async (req, res, next) => {
  try {
    const result = await deleteByIdUsers(req.params.id);
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.USER_DELETED_SUCCESS, data: result });
  } catch (error) {
    next(error);
  }
});

// Change user password
router.post('/change-password', validate(userValidation.changePassword), async function (req, res, next) {
  try {
    await userChangePassword({ id: req.user.id, body: req.body })
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.PASSWORD_CHANGE_SUCCESS });
  } catch (error) {
    return next(error)
  }
})

module.exports = router;
