var express = require('express');
const User = require("../models/users")
const validate = require('../middleware/validate');
const authValidation = require('../middleware/validators/authValidations');
var router = express.Router();