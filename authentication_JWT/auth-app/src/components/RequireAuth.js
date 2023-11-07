import React, { useEffect, useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const refreshAccessToken = useRefreshToken();
    const { setAuth } = useAuth();


    useEffect(() => {
        const checkToken = async () => {
            try {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    setAuth(prev => {
                        return { ...prev, accessToken: newAccessToken }
                    });
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                    setFailed(true);
                    console.log('failed')
                }
            } catch (error) {
                setIsLoading(false);
                console.error("Token refresh failed:", error);
            }
        }
        if (!auth.accessToken) {
            checkToken();
        }
    }, [])

    return (
        <div>
            {isLoading && (
                <div>
                    Loading...
                    <script>{console.log('isloading === true')}</script>
                </div>
            )}
            {auth.accessToken && (
                <div>
                    <script>{console.log('made it here, its supposed to go to outlet')}</script>
                    <Outlet />
                </div>
            )}
            {failed && (
                <div><Navigate to="/login" state={{ from: location }} replace /></div>
            )}
        </div>
    )
};

export default RequireAuth;