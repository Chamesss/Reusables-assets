import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { login } from '../api/UserApi';
import { useMutation } from '@tanstack/react-query'

const Login = () => {
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const { setAuth } = useAuth();
    const navigate = useNavigate();



    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setAuth({ user: data.user, accessToken: data.accessToken })
            setUser('');
            setPwd('');
            navigate('/protected');
        },
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        mutation.mutate({ user, pwd });
    }

    return (
        <section>
            <h1>Sign In</h1>
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
                <button type="submit" disabled={mutation.isPending || !user || !pwd}>
                    {mutation.isPending ? 'Logging in...' : 'Log in'}
                </button>
                {mutation.error && <p>{mutation.error.message}</p>}
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