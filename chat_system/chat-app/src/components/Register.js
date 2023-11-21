import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { registerUser } from '../api/UserApi';
import { useMutation } from '@tanstack/react-query'

const Register = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [matchPwd, setMatchPwd] = useState('')
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            setAuth({ user: data.user, accessToken: data.accessToken })
            navigate('/protected');
        },
        onMutate: async ({ firstName, lastName, email, pwd }) => {
            if (pwd !== matchPwd) {
                throw new Error("Passwords doesn't match")
            }
            return { firstName, lastName, email, pwd }
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        mutation.mutate({ firstName, lastName, email, pwd })
    }

    return (
        <section>
            <h1>Register</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="firstname">
                    Firstname:
                </label>
                <br />
                <input
                    type="text"
                    id="firstname"
                    autoComplete="off"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    required
                />
                <br />
                <label htmlFor="lastname">
                    Lastname:
                </label>
                <br />
                <input
                    type="text"
                    id="lastname"
                    autoComplete="off"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    required
                />
                <br />
                <label htmlFor="email">
                    email:
                </label>
                <br />
                <input
                    type="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
                <br />
                <label htmlFor="password">
                    Password:
                </label>
                <br />
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <br />
                <label htmlFor="confirm_pwd">
                    Confirm Password:
                </label>
                <br />
                <input
                    type="password"
                    id="confirm_pwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                />
                <br />
                {mutation.error && <p>{mutation.error.message}</p>}
                <button type="submit">
                    {mutation.isPending ? 'Pending...' : 'Register'}
                </button>
            </form>
            <p>
                Already registered? <br />
                <span className="line">
                    <Link to="/login">Sign In</Link>
                    <br />
                    <Link to="/">Home</Link>
                </span>
            </p>
        </section>
    )
}

export default Register