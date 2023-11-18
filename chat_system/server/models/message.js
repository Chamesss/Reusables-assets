const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        senderName: {
            type: String,
        },
        text: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
