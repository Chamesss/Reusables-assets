const Message = require("../models/message");
const User = require("../models/user")

exports.addMessage = async (req, res) => {
    const newMessage = new Message(req.body);
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json({ savedMessage });
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        console.log(messages)
        console.log(req.params.conversationId)
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err)
    }
}