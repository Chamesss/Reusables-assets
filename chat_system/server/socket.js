const socketIo = require("socket.io");

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => (user.userId === userId)) &&
    users.push({ userId, socketId, conversations: [] });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (id) => {
  return users.find((user) => (user.userId === id) || (user.socketId === id));
};

const addConversation = (userId, receiverId) => {
  const user = getUser(userId);
  const receiver = getUser(receiverId);

  if (user && receiver) {
    console.log('conv added')
    user.conversations.push({
      userId: receiverId,
      socketId: receiver.socketId,
    });
  }
};

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected.");

    // take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
    });

    // add a new conversation for the user
    socket.on("addConversation", ( userId, receiverId ) => {
      const user = getUser(userId);
      addConversation(user.userId, receiverId);
    });

    // send and get message
    socket.on("sendMessage", ({ senderName, receiverId, text }) => {
      const user = getUser(socket.id);
      let conversation = user.conversations.find((conv) => conv.userId === receiverId);
    
      if (!conversation) {
        const receiverExist = getUser(receiverId);
        if (receiverExist) {
          addConversation(user.userId, receiverId);
          conversation = user.conversations.find((conv) => conv.userId === receiverId);
        } 
      }
    
      if (conversation) {
        io.to(conversation.socketId).emit("getMessage", {
          senderName,
          text,
        });
      }
    });

    // when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
    });
  });
};

module.exports = initializeSocket;