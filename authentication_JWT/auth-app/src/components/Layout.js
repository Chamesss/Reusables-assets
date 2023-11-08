import { Outlet } from "react-router-dom"
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import axios from "../api/axios";
const Layout = () => {

    const { auth } = useAuth();
    const refreshAccessToken = useRefreshToken();
    const { setAuth } = useAuth();
    const [terminated, setTerminated] = useState(false);

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const checkToken = async () => {
            try {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    const response = await axios.get('/user/verifyjwt', {
                        headers: {
                            'Authorization': `Bearer ${newAccessToken}`,
                            'nonext': true,
                        }
                    });
                    setAuth({ user: response.data, accessToken: newAccessToken })
                }
            } catch (err) {
                setAuth({ user: null, accessToken: null })
            } finally {
                setTerminated(true);
            }
        }
        if (!auth.user || !auth.accessToken) {
            checkToken();
        }
    }, [])

    return (
        <main className="App">
            {!terminated &&
                <div>
                    Loading...
                </div>
            }
            {terminated &&
                <Outlet />
            }
        </main>
    )
}

export default Layout