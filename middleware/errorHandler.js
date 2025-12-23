const { STATUS_CODE, MESSAGES } = require("../utils/constants");

const error = (err, req, res, next) => {
  res
    .status(err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR)
    .json(require("./responseHandler")(err.message || MESSAGES.INTERNAL_SERVER_ERROR, [], "ERROR"));
};

module.exports = error;
