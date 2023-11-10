import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';

const Chat = () => {
    const { recieverId } = useParams();
    const { auth } = useAuth();
    const [conversation, setconversation] = useState(null);
    const [conversationId, setconversationId] = useState(null);
    const [messages, setMessages] = useState(null);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const server = io("ws://localhost:8080")
        server.on('connect', () => {
            console.log('connected !');
        })
        const getConversation = async () => {
            try {
                const response = await axios.get(`/chat/conversation/find/${auth.user._id}/${recieverId}`)
                setconversation(response.data);
                setconversationId(response.data._id);
            } catch (err) {
                console.log(err);
            }
        }
        getConversation();
    }, [])

    useEffect(() => {
        console.log(conversationId)
        const getMessages = async () => {
            try {
                const response = await axios.get(`/chat/msg/${conversationId}`);
                setMessages(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
    }, [conversationId]);

    const handleSubmit = async () => {
        let conversationid;
        if (!conversation) {
            try {
                const response = await axios.post('/chat/conversation', {
                    senderId: auth.user._id,
                    receiverId: recieverId,
                })
                setconversationId(response.data._id);
                conversationid = response.data._id;
            } catch (err) {
                console.log(err)
            }
        }

        try {
            const response = await axios.post('/chat/msg', {
                conversationId: conversationId || conversationid,
                sender: auth.user._id,
                text: msg,
            })
        } catch (err) {
            console.log(err)
        }
    }



    return (
        <div>
            <p>Received id: {recieverId}</p>
            <input
                placeholder='type a msg'
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
            />
            <button onClick={handleSubmit} disabled={msg.length < 1}>Send</button>
            <h3>Conversation: </h3>
            {conversation ?
                (
                    <div>
                        <p>Messages :</p>
                        {messages && (
                            <>
                                {messages.map((message) => {
                                    return (
                                        <p key={message._id}>{message.text}</p>
                                    )
                                })}
                            </>
                        )}
                    </div>
                ) : (
                    <p>Start a conversation</p>
                )}
        </div>
    )
}

export default Chat