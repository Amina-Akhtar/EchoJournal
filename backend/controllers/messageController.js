const Message = require('../models/messageModel');

exports.loadMessages = async (req, res) => {
    try{
        const messages = await Message.find().sort({ createdAt: 1 });
        res.json(messages);
    }
    catch(err){
        console.error("Failed to load messages", err);
        res.status(500).json({ error: "Failed to load messages" });
    }
};