const socketIo = require("socket.io");
const User = require('./models/user')
const Conversation = require('./models/conversation')

let conversationIdGlobal;


const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const user_id = socket.handshake.query["user_id"]
    console.log(`user ${user_id} connected.`);

    socket.on("statusOnline", async (user_id) => {
      try {
        const status = await User.findByIdAndUpdate(user_id, {
          status: "Online"
        })
        await status.save()
      } catch (error) {
        console.log(error)
      }
    })

    socket.on("addConversation", (conversation_id) => {
      conversationIdGlobal = conversation_id
    })

    socket.on("addSocket", async (conversation_id, user_id) => {
      try {
        const chat = await Conversation.findById(conversation_id)
        const userIndex = chat.participant.findIndex((id) => (id.user.toString() === user_id))
        if (userIndex !== -1) {
          if (!chat.participant[userIndex].sockets) {
            chat.participant[userIndex].sockets = [];
          }
          chat.participant[userIndex].sockets.push(socket.id);
          await chat.save();
        }
      } catch (error) {
        console.log(error)
      }
    })

    // Send typing event to all same conversations
    socket.on("typing", async (conversation_id, senderName, receiver_id) => {
      const chat = await Conversation.findById(conversation_id);
      const receiverParticipant = chat?.participant.find(participant => participant.user.toString() === receiver_id);
      receiverParticipant?.sockets.forEach(socket => io.to(socket).emit("typing", senderName));
    })

    // send and get message 
    socket.on("sendMessage", async (user_id, receiver_id, conversation_id, text) => {
      if (!conversation_id) {
        conversation_id = conversationIdGlobal
      }
      try {
        const chat = await Conversation.findById(conversation_id);
        const message = { to: receiver_id, from: user_id, created_at: Date.now(), text };
        chat.messages.push(message);
        const savedMessage = await chat.save();
        savedMessage.participant.forEach(participant => {
          if (participant.sockets) {
            participant.sockets.forEach(s => io.to(s).emit("getMessage", { conversation_id, message }));
          }
        });
      } catch (error) {
        io.to(socket.id).emit("errorSendMessage", { error });
      }
    });

    // when disconnect
    socket.on("disconnect", async () => {
      try {
        if (conversationIdGlobal && conversationIdGlobal.length > 0) {
          await Conversation.findOneAndUpdate(
            { 'participant.user': user_id, 'participant.sockets': socket.id },
            { $pull: { 'participant.$.sockets': socket.id } },
            { new: true, versionKey: false }
          );
          console.log('Socket removed:', socket.id);
        } else {
          console.log('No conversation id???');
        }
      } catch (error) {
        console.error('Error removing socket:', error);
      } finally {
        try {
          console.log(`User ${user_id} has disconnected.`);
          const status = await User.findByIdAndUpdate(user_id, {
            status: "Offline"
          });
          await status.save();
        } catch (error) {
          console.error('Error updating user status:', error);
        }
      }
    });
  });
};

module.exports = initializeSocket;