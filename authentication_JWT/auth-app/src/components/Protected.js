import React, { useState } from 'react'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import axios from '../api/axios';
import useAuth from "../hooks/useAuth";

const Protected = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth } = useAuth();
    const { auth } = useAuth();
    const [state, setState] = useState(null)

    const fallBack = () => {
        return navigate('/login', { state: { from: location }, replace: true });
    }

    const doAction = async () => {
        try {
            const response = await axiosPrivate.get('/user/action');
            setState(response.data);
        } catch (err) {
            console.error(err);
            fallBack()
        }
    }

    const logOut = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.get('/user/logout', {
                withCredentials: true
            });
            if (response.data.success === true) {
                setAuth({ user: null, accessToken: null })
                fallBack()
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <section>
            <h1>Welcome {auth.user.firstName} {auth.user.lastName} !</h1>
            <h1>I'm {auth.user.age} y.o</h1>
            {state && Object.entries(state).map(([key, value]) => (
                <p key={key}>
                    {key}: {value}
                </p>
            ))}
            <br />
            <button onClick={doAction}>Do Action</button>
            <br />
            <button onClick={(e) => logOut(e)}>Log Out</button>
        </section>
    )
}

export default Protected