import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';

const Chat = () => {
    const { recieverId } = useParams();
    const { auth } = useAuth();
    const [conversation, setconversation] = useState(null);
    const [messages, setMessages] = useState(null);
    const [msg, setMsg] = useState('');
    const [lastMsg, setLastMsg] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [server, setServer] = useState(null);
    const [mounted, setMounted] = useState(false)
    const [typing, setTyping] = useState('')

    /* eslint-disable react-hooks/exhaustive-deps */


    const getMessages = async (conv_id) => {
        try {
            const response = await axios.get(`/chat/msg/${conv_id}`);
            setMessages(response.data);
            console.log(response.data)
        } catch (err) {
            console.log(err);
        }
    };

    const getConversation = async () => {
        try {
            const response = await axios.get(`/chat/conversation/find/${auth.user._id}/${recieverId}`)
            console.log('conversation found === ', response.data)
            setconversation(response.data ?? null);
            return response.data?._id ?? null;
        } catch (err) {
            console.log(err);
        }
    }

    const handleTyping = (e) => {
        setMsg(e.target.value);
        server.emit("typing", auth.user.firstName, auth.user._id, recieverId)
    }

    useEffect(() => {
        if (!server) {
            setServer(io("ws://localhost:8080"));
        }

        return () => {
            server?.disconnect();
        };
    }, [server]);

    useEffect(() => {
        if (!server || !auth) return;
        server.on('connect', () => {
            console.log('user connected')
        })

        server.emit("addUser", auth.user._id, recieverId);

        server.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderName,
                text: data.text,
                createdAt: Date.now(),
            });
            setLastMsg('')
            setTyping('')
            if (auth.user._id !== data.senderId) {
                server.emit("delivered", auth.user._id, recieverId)
            }
        });

        let activityTimer
        server.on("typing", (senderName) => {
            setTyping(`${senderName} is typing...`)
            clearTimeout(activityTimer)
            activityTimer = setTimeout(() => {
                setTyping('');
            }, 3000)
        })

        server.on("delivered", (socketId) => {
            console.log(socketId)
            setLastMsg("msg delivered !")
        })

        const handleStart = async () => {
            const conv_id = await getConversation();
            getMessages(conv_id);
            setMounted(true);
        }

        handleStart();

        return () => {
            server.off('connect');
            server.off('getMessage');
        };
    }, [auth, server, recieverId])


    useEffect(() => {
        if (!messages) return
        if (!conversation) {
            getConversation();
        }
        setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);


    const handleSubmit = async (e) => {
        e.preventDefault()
        setTyping('')
        setMsg('')
        setLastMsg('')
        let conversationid
        if (!conversation) {
            try {
                const response = await axios.post('/chat/conversation', {
                    senderId: auth.user._id,
                    receiverId: recieverId,
                })
                conversationid = response.data._id;
                setconversation(response.data)
            } catch (err) {
                console.log(err)
            }
        }

        server.emit("sendMessage", {
            senderId: auth.user._id,
            senderName: auth.user.firstName + ' ' + auth.user.lastName,
            receiverId: recieverId,
            text: msg,
        });

        try {
            const response = await axios.post('/chat/msg', {
                conversationId: conversation?._id || conversationid,
                sender: auth.user.firstName + ' ' + auth.user.lastName,
                text: msg,
            })
            console.log(response.data)
            setMessages([...messages, response.data.savedMessage]);
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
                onChange={(e) => handleTyping(e)}
            />
            <button onClick={handleSubmit} disabled={msg.length < 1}>Send</button>
            <h3>Conversation: </h3>
            {mounted && (
                <>
                    {conversation ?
                        (
                            <>
                                <p>Messages :</p>
                                {messages && (
                                    <>
                                        {messages.map((message) => {
                                            return (
                                                <p key={message._id}>{message.text} from {message.sender}</p>
                                            )
                                        })}
                                    </>
                                )}
                                {lastMsg && <p>{lastMsg}</p>}
                                {typing && <p>{typing}</p>}
                            </>
                        ) : (
                            <p>Start a conversation</p>
                        )}
                </>
            )}
        </div>
    )
}

export default Chat