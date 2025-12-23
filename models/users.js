const mongoose = require('mongoose');

// Define the schema for the user
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
        select: false
    },
    resetToken: {
        type: String,
        default: null
    },
    isDisabled: {
        type: Boolean,
        defaule: false
    },
    expiresIn: {
        type: Date,
        default: null
    },
}, { timestamps: true });  // This will automatically add createdAt and updatedAt fields

// Create the model
const User = mongoose.model('user', userSchema);

module.exports = User;
