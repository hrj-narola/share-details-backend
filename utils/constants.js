const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  DUPLICATE_KEY: 11000
}

const MESSAGES = {
  NOT_FOUND: "Data Not found",
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "User already exists",
  USERS_NOT_FOUND: "Users not found",
  INCORRECT_OLD_PASSWORD: "Old password is incorrect",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  USER_NOT_REGISTERED: "User Not Registered, please signup!",
  UNABLE_SEND_RESET_PASSWORD_EMAIL: "Unable to send password reset email. Please try again later.",
  TOKEN_EXPIRED: "Token has been expired",
  TOKEN_NOT_MATCHED: "Token not matched",
  SOMETHING_WENT_WRONG: "Something went wrong!",
  UNAUTHORIZED: "You are unauthorized to perform this action",
  USER_REGISTRATION_SUCCESS: "User registered successfully",
  USER_LOGIN_SUCCESS: "User logged in successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  PASSWORD_CHANGE_SUCCESS: "Password successfully changed!",
  USER_DELETED_SUCCESS: "User deleted successfully",
  USER_UPDATED_SUCCESS: "User successfully updated!",
  SUCCESS: "Success!",
  INTERNAL_SERVER_ERROR: "Internal server error",
  CATEGORIES_NOT_FOUND: "Categories not found",
  CATEGORY_NOT_FOUND: "Category not found",
  CATEGORY_ALREADY_EXISTS: "Category already exists",
  UPDATE_CATEGORY_ERROR: "Please provide category data to update",
  DELETE_CATEGORY_ERROR: "There are subcategories associated with this category. Pleaase delete them first.",
  PRODUCT_NOT_FOUND: "Products not found!",
  INQUIRIES_NOT_FOUND: "Inquiries not found!",
  STATUS_ALREADY_CREATED: "Status with the same name already created!"
}

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT) || 10;
module.exports = { STATUS_CODE, MESSAGES, SALT_ROUNDS }