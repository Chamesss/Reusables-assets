import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';
import { addConversation } from '../api/ChatApi';
import axios from '../api/axios';

const Chat = () => {

    const { receiver_id } = useParams();
    const [socket, setSocket] = useState('')
    const { auth } = useAuth();
    const [conversation, setconversation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [typing, setTyping] = useState('')
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [msg, setMsg] = useState('');
    const [messages, setMessages] = useState('');

    /* eslint-disable react-hooks/exhaustive-deps */

    /* UseEffects */

    useEffect(() => {
        if (!auth || !receiver_id || !socket) { return }
        socket.emit("statusOnline", auth.user._id)
        getConversation()

        //Typing event
        let activityTimer
        socket.on("typing", (senderName) => {
            setTyping(`${senderName} is typing...`)
            clearTimeout(activityTimer)
            activityTimer = setTimeout(() => {
                setTyping('');
            }, 3000)
        })

        //NewMessage event
        socket.on("getMessage", (data) => {
            setArrivalMessage({
                from: data.message.from,
                text: data.message.text,
                createdAt: data.message.created_at,
            });
            setTyping('')
        });

    }, [auth, receiver_id, socket])

    useEffect(() => {
        setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        if (!auth) { return }
        if (!socket) {
            setSocket(io("ws://localhost:8080", {
                query: `user_id=${auth.user._id}`
            }))
            return
        }
        return () => {
            socket?.off("connect");
        };
    }, [auth])

    /* End UseEffects */


    /* Functions */

    const getConversation = async () => {
        try {
            const response = await axios.get(`/chat/conversation/find/${auth.user._id}/${receiver_id}`)
            if (response.data) {
                console.log(response.data)
                setconversation(response.data);
                setMessages(response.data.messages)
                socket.emit("addConversation", response.data._id);
                socket.emit("addSocket", response.data._id, auth.user._id)
            } else {
                mutation.mutate({ senderId: auth.user._id, receiver_id })
            }
            setLoading(false)
        } catch (err) {
            console.log(err);
        }
    }

    const handleTyping = (e) => {
        setMsg(e.target.value);
        socket.emit("typing", conversation._id, auth.user.firstName, receiver_id)
    }

    const mutation = useMutation({
        mutationFn: addConversation,
        onSuccess: (data) => {
            socket.emit("addConversation", data._id);
            socket.emit("addSocket", data._id, auth.user._id)
            setconversation(data)
            setMessages(data.messages)
        },
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setTyping('')
        setMsg('')
        socket.emit("sendMessage",
            auth.user._id,
            receiver_id,
            conversation._id,
            msg,
        );
    }

    /* End Functions */

    return (

        <div>
            <p>Received id: {receiver_id}</p>
            <input
                placeholder='type a msg'
                value={msg}
                onChange={(e) => handleTyping(e)}
            />
            <button onClick={handleSubmit} disabled={msg.length < 1}>Send</button>
            <h3>Conversation: </h3>
            {!loading && (
                <>
                    {conversation ?
                        (
                            <>
                                <p>Messages :</p>

                                {messages.map((message) => {
                                    return (
                                        <p key={message._id}>{message.text} from {message.from}</p>
                                    )
                                })}
                                {typing && <p>{typing}</p>}
                                {/* status && <p>msg delivered</p> */}
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