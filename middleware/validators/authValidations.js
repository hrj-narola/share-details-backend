const { body } = require('express-validator');

const authValidation = {
    login: [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    register: [
        body('email').isEmail().withMessage('Invalid email address'),
        body('name').notEmpty().withMessage('Name is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    forgotPassword: [
        body('email').isEmail().withMessage('Invalid email address')
    ],
    resetPassword: [
        body('token')
            .notEmpty()
            .withMessage('Token is required'),

        body('newPassword')
            .notEmpty()
            .withMessage('New password is required'),

        body('confirmNewPassword')
            .notEmpty()
            .withMessage('Confirm password is required')
            .custom((_, { req }) => {
                if (req.body.newPassword !== req.body.confirmNewPassword) {
                    throw new Error('New Password and Confirm New password must be same');
                }
                return true;
            })
    ],

}

module.exports = authValidation;