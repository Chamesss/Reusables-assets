const Conversation = require('../models/conversation');

exports.newConversation = async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getAllConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId] }
        })
        res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getConversationOfTwoUsers = async (req, res) => {
    let conversation
    try {
        if (req.params.firstUserId !== req.params.secondUserId) {
            conversation = await Conversation.findOne({
                $and: [
                    { members: { $elemMatch: { $eq: req.params.firstUserId } } },
                    { members: { $elemMatch: { $eq: req.params.secondUserId } } }
                ]
            });
        } else {
            conversation = await Conversation.aggregate([
                {
                    $project: {
                        members: {
                            $slice: ['$members', 2]
                        }
                    }
                },
                {
                    $match: {
                        members: [req.params.firstUserId, req.params.secondUserId]
                    }
                }
            ])
            conversation = conversation[0]
        }

        res.status(200).json(conversation);
    } catch (err) {
        console.log('error === ', err)
        res.status(500).json(err)
    }
}