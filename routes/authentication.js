var express = require('express');

const validate = require('../middleware/validate');
const authValidation = require('../middleware/validators/authValidations');

const { userRegister, userLogin, userForgotPassword, userResetPassword } = require('../controller/auth.controller');

const { STATUS_CODE, MESSAGES } = require('../utils/constants');

var router = express.Router();

// Register user
router.post('/register', validate(authValidation.register), async function (req, res, next) {
  try {
    const user = await userRegister(req.body)
    res.status(STATUS_CODE.CREATED).json({ msg: MESSAGES.USER_REGISTRATION_SUCCESS, user });
  } catch (error) {
    return next(error)
  }
});

// Login user
router.post('/login', validate(authValidation.login), async function (req, res, next) {
  try {
    const user = await userLogin(req.body)
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.USER_LOGIN_SUCCESS, data: user });
  } catch (error) {
    return next(error)
  }
})

// Forgot password
router.post('/forgot-password', validate(authValidation.forgotPassword), async function (req, res, next) {
  try {
    const user = await userForgotPassword(req.body)
    res.status(STATUS_CODE.OK).json({ msg: `Reset Link sent to your email ${user.email}` });
  } catch (error) {
    return next(error)
  }
})

// Reset password
router.post('/reset-password', validate(authValidation.resetPassword), async function (req, res, next) {
  try {
    await userResetPassword(req.body)
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.PASSWORD_RESET_SUCCESS });
  } catch (error) {
    return next(error)
  }
})


module.exports = router;
