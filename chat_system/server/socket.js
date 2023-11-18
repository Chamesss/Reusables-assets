const socketIo = require("socket.io");
const User = require('./models/user')

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
  const userExistIndex = users.findIndex(user => user.conversations.some((cnv) => cnv.socketId === socketId))
  console.log('user index === ', userExistIndex)
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

const updateUserStatusActive = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      user.status = true
      user.save()
    }
  } catch (err) {
    console.log(err)
  }
}

const updateUserStatusOffline = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      user.status = false
      user.save()
    }
  } catch (err) {
    console.log(err)
  }
}

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected.");
    const userId = socket.handshake.query.userId;
    updateUserStatusActive(userId)

    // Add new user that contain the socketId related to all same conversations
    socket.on("addUser", (userId, receiverId) => {
      addUser(userId, socket.id, receiverId);
    });

    // Send typing event to all same conversations
    socket.on("typing", (senderName, senderId, receiverId) => {
      const receiver = getUser(receiverId);
      if (receiver) {
        const conversationsReceiver = receiver.conversations.filter((cnv) => {
          return cnv.receiverId === senderId
        })
        conversationsReceiver.map((cnv => {
          io.to(cnv.socketId).emit("typing", senderName)
        }))
      }
    })

    // send and get message 
    socket.on("sendMessage", ({ senderId, senderName, receiverId, text }) => {
      const receiver = getUser(receiverId);
      const sender = getUser(senderId)
      if (receiver) {
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
              senderId,
              senderName,
              text,
            });
          }))
        }
      }
    });

    // when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      updateUserStatusOffline(userId)
    });
  });
};

module.exports = initializeSocket;