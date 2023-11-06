import React from 'react'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Protected = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const doAction = async () => {
        try {
            const response = await axiosPrivate.get('/user/action');
            console.log(response.data);
        } catch (err) {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    return (
        <section>
            <h1>Welcome !</h1>
            <button onClick={doAction}>Do Action</button>
        </section>
    )
}

export default Protected