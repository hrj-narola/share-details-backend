const createHttpError = require("http-errors")
const bcrypt = require("bcrypt")

const User = require("../models/users")

const { STATUS_CODE, MESSAGES, SALT_ROUNDS } = require("../utils/constants")


exports.getAllUsers = async () => {
  const users = await User.find()
  if (!users.length) {
    throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.USERS_NOT_FOUND)
  }
  return users
}

exports.getByIdUsers = async (id) => {
  const user = await User.findById(id)
  if (!user) {
    throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.USER_NOT_FOUND)
  }
  return user
}

exports.updateByIdUsers = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, { new: true })
  if (!user) {
    throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.USER_NOT_FOUND)
  }
  return user
}

exports.deleteByIdUsers = async (id) => {
  const user = await User.findByIdAndDelete(id)
  if (!user) {
    throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.USER_NOT_FOUND)
  }
}

exports.userChangePassword = async ({ id, body }) => {
  const user = await User.findById(id, { password: 1 })
  if (!user) {
    throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.USER_NOT_FOUND)
  }
  if (!(await bcrypt.compare(body.oldPassword, user.password))) {
    throw new createHttpError(STATUS_CODE.UNAUTHORIZED, MESSAGES.INCORRECT_OLD_PASSWORD)
  }
  const hashedPassword = await bcrypt.hash(body.newPassword, SALT_ROUNDS);
  user.password = hashedPassword
  await user.save()
  return user
}