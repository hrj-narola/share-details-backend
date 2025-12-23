const { validationResult } = require('express-validator');
const { STATUS_CODE } = require('../utils/constants');

/**
 * Function to apply validation rules and handle errors
 * @param {Array} validations - Array of validation rules from express-validator
 * @returns {Function} Middleware function
 */

const validate = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map((validation) => validation.run(req)));

        // Collect validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ errors: errors.array() });
        }

        next();
    };
};

module.exports = validate;
