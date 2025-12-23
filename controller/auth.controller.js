const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const crypto = require("crypto")

const User = require("../models/users");
const generateToken = require("../middleware/generateToken");
const sendPasswordResetMail = require("../services/mail.service");

const { STATUS_CODE, SALT_ROUNDS, MESSAGES } = require("../utils/constants");

const secretKey = process.env.SECRET_KEY;
exports.userRegister = async ({ email, password, name }) => {
  if (!password) {
    throw createHttpError(STATUS_CODE.BAD_REQUEST, "Password is required")
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(STATUS_CODE.BAD_REQUEST, MESSAGES.USER_ALREADY_EXISTS);
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = await User.create({
    email,
    password: hashedPassword,
    name,
  });

  const userObj = newUser.toObject();
  delete userObj.password;

  return userObj;
};

exports.userLogin = async ({ email, password }) => {
  const user = await User.findOne({ email }, { password: 1 });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(STATUS_CODE.UNAUTHORIZED, MESSAGES.INVALID_EMAIL_OR_PASSWORD);
  }
  const token = generateToken({ id: user.id }, secretKey);
  return { _id: user.id, token };
};

exports.userForgotPassword = async ({ email }) => {
  const userFilter = { email }

  const user = await User.findOne(userFilter);
  if (!user) { throw createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.USER_NOT_REGISTERED) };
  try {
    const token = crypto.randomBytes(26).toString("hex");
    await sendPasswordResetMail(user, token).then(async () => {
      user.resetToken = token
      const expiresIn = new Date(new Date().getTime() + 300000)
      user.expiresIn = expiresIn
      await user.save()
      return user;
    })
  } catch (err) {
    throw createHttpError(STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGES.UNABLE_SEND_RESET_PASSWORD_EMAIL);
  }
  return user
}


exports.userResetPassword = async ({ token, newPassword }) => {
  const user = await User.findOne({ resetToken: token });
  if (!user) {
    throw createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.TOKEN_NOT_MATCHED);
  }
  if (!user.expiresIn || new Date(user.expiresIn).getTime() < Date.now()) {
    throw createHttpError(STATUS_CODE.UNPROCESSABLE_ENTITY, MESSAGES.TOKEN_EXPIRED);
  }
  try {
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashedPassword;
    user.resetToken = null;
    user.expiresIn = null;
    await user.save();
    return user;
  } catch (err) {
    throw createHttpError(STATUS_CODE.BAD_REQUEST, MESSAGES.SOMETHING_WENT_WRONG);
  }
};