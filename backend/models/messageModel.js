const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;