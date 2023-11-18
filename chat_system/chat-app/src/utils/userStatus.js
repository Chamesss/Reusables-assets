import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';

const userStatus = () => {
    const [server, setServer] = useState(null);
    const { auth } = useAuth();
    const { setAuth } = useAuth();

    useEffect(() => {
        if (!server || !auth) {
            setServer(io("ws://localhost:8080", {
                query: {
                    userId: 'yourUserId',
                },
            }));
            return
        };
        server.on('connect', () => {
            console.log('user connected')
            setAuth({ ...prev, status: true })
        })
        return () => {
            server.off('connect');
            server?.disconnect();
        };
    }, [auth, server])

    return (
        <Outlet />
    )
}

export default userStatus