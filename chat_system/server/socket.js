const socketIo = require("socket.io");

let users = [];

const addUser = (userId, socketId, receiverId) => {
  const userExistIndex = users.findIndex(user => (
    user.userId === userId
  ))
  if (userExistIndex > -1) {
    const conversationIndex = users[userExistIndex].conversations.findIndex(cnv => (
      cnv.socketId === socketId && cnv.receiverId === receiverId
    ))
    if (conversationIndex === -1) {
      users[userExistIndex].conversations.push({
        socketId,
        receiverId
      })
    }
  } else {
    users.push({ userId, conversations: [{ socketId, receiverId }] });
  }
};

const removeUser = (socketId) => {
  const userExistIndex = users.findIndex(user => user.conversations.socketId === socketId)
  if (userExistIndex !== -1) {
    const updatedUser = {
      ...users[userExistIndex],
      conversations: users[userExistIndex].conversations.filter(cnv => cnv.socketId !== socketId)
    }
    users[userExistIndex] = updatedUser
  }
  users = users.filter((user) => user.conversations.some(cnv => cnv.socketId.length > 0));
};

const getUser = (id) => {
  return users.find((user) => (user.userId === id));
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
    socket.on("addUser", (userId, receiverId) => {
      addUser(userId, socket.id, receiverId);
    });

    // send and get message
    socket.on("sendMessage", ({ senderId, senderName, receiverId, text }) => {
      const receiver = getUser(receiverId);
      const sender = getUser(senderId)
      const conversationsReceiver = receiver.conversations.filter((cnv) => {
        return cnv.receiverId === senderId
      })
      const conversationsSender = sender.conversations.filter((cnv) => {
        return cnv.receiverId === receiverId;
      });
      const conversations = [...conversationsReceiver, ...conversationsSender];
      if (conversations.length > 0) {
        conversations.map((cnv => {
          io.to(cnv.socketId).emit("getMessage", {
            senderName,
            text,
          });
        }))
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