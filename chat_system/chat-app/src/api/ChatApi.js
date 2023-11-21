import axios from "./axios";

const getConversation = async ({ queryKey }) => {
    try {
        const [_, data] = queryKey
        console.log('sender id from api getConversation === ', data.sender_Id)
        console.log('receiver id from api getConversation === ', data.receiver_Id)
        const response = await axios.get(`/chat/conversation/find/${data.sender_Id}/${data.receiver_Id}`);
        console.log('response from api getConversation === ', response.data)
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch Conversation.');
    }
};

const addConversation = async (data) => {
    try {
        const response = await axios.post('/chat/conversation', {
            senderId: data.senderId,
            receiverId: data.receiver_id,
        })
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export { getConversation, addConversation };