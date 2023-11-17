const users = [];

const addConversation = (senderId, receiverId, senderSocket) => {
    const cnvExists = users.some(user => (
        Object.values(user).includes(senderId) && Object.values(user).includes(receiverId)
    ))
    if (cnvExists) {
        users[cnvExists].socket2 = senderSocket;
    } else {
        users.push({
            id1: senderId,
            id2: receiverId,
            socket1: senderSocket
        })
    }
}

const getConversation = (senderId, receiverId) => {
    const cnvExists = users.some(user => (
        Object.values(user).includes(senderId) && Object.values(user).includes(receiverId)
    ))
    return cnvExists
}