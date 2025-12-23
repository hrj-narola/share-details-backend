const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) throw createHttpError(STATUS_CODE.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    const userToken = token.split(" ")[1];
    if (!userToken) throw createHttpError(STATUS_CODE.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    const payload = jwt.verify(userToken, process.env.SECRET_KEY);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = verifyToken;
