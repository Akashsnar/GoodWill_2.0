const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
