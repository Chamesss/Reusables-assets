import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';

const Login = () => {
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [error, setError] = useState('');
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user/login',
                JSON.stringify({ firstName: user, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            setAuth({ user: response.data.user, accessToken: response.data.accessToken })
            setUser('');
            setPwd('');
            navigate('/protected');
        } catch (error) {
            setError('Incorrect username or password')
        }
    }

    return (
        <section>
            <h1>Sign In</h1>
            {error && (<p>{error}</p>)}
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <br />
                <input
                    type="text"
                    id="username"
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />
                <br />
                <label htmlFor="password">Password:</label>
                <br />
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <br />
                <button>Sign In</button>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                    <br />
                    <Link to="/">Home</Link>
                </span>
            </p>
        </section>
    )
}

export default Login