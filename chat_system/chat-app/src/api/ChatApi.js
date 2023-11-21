import axios from "./axios";

const getConversation = async (data) => {
    try {
        const response = await axios.get(`/chat/conversation/find/${data.sender_id}/${data.receiver_id}`)
        return response.data
    } catch (err) {
        throw new Error('Failed to fetch Conversation.')
    }
}

export {getConversation};