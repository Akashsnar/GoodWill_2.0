const mongoose = require('mongoose');

const getContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
});

const User = mongoose.model('getcontact', userSchema);

module.exports = User;
