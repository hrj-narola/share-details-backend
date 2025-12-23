const { param, body } = require('express-validator');

const userValidation = {
  delete: [
    param("id").notEmpty().withMessage("Id is required")
  ],
  update: [
    param("id").notEmpty().withMessage("Id is required"),
    body('name').optional().trim().isLength({
      min: 2,
    }).withMessage('Name is required and can add min 2 characters'),

  ],
  changePassword: [
    body('oldPassword').notEmpty().withMessage("Old password is required"),
    body('newPassword').notEmpty().withMessage("New password is required"),
    body('confirmNewPassword')
      .notEmpty()
      .withMessage('Confirm password is required')
      .custom((_, { req }) => {
        if (req.body.newPassword !== req.body.confirmNewPassword) {
          throw new Error('New Password and Confirm New password must be same');
        }
        return true;
      })
  ]
}


module.exports = userValidation;