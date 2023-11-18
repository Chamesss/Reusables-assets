import React, {useEffect, useState} from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { io } from 'socket.io-client';

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const [server, setServer] = useState(null);
    const { setAuth } = useAuth();

    useEffect(() => {
        if (!server || !auth) {
            setServer(io("ws://localhost:8080", {
                query: {
                    userId: auth.user._id,
                },
            }));
            return
        };
        server.on('connect', () => {
            console.log('user connected')
            setAuth(prev => {
                return { ...prev, status: true }
            });
        })
        console.log("youpi")
        return () => {
            server.off('connect');
            server?.disconnect();
        };
    }, [auth, server])

    return (
        auth.accessToken 
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;