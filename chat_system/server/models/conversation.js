const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    participant: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
            sockets: [
                {
                    type: String,
                },
            ],
        },
    ],
    messages: [
        {
            to: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
            from: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
            created_at: {
                type: Date,
                default: Date.now(),
            },
            text: {
                type: String,
            },
        }
    ]
})
module.exports = mongoose.model("Conversation", ConversationSchema);