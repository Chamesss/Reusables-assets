import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';


const Register = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [matchPwd, setMatchPwd] = useState('')
    const [error, setError] = useState('');
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstName || firstName.length < 3) {
            setError('Invalid firstname')
            return
        }
        if (!lastName || lastName.length < 3) {
            setError('Invalid lastName')
            return
        }
        if (!pwd) {
            setError('Enter your password')
            return
        }
        if (!matchPwd) {
            setError('Enter confirm password')
            return
        }
        if (pwd !== matchPwd) {
            setError(`passwords doesn't match`)
            return
        }
        if (!email || email.length < 3) {
            setError(`passwords doesn't match`)
            return
        }

        try {
            const response = await axios.post('/user/createuser', {
                firstName,
                lastName,
                email,
                password: pwd
            })
            if (response.status === 200) {
                setAuth({ user: response.data.user, accessToken: response.data.accessToken })
                setError('');
                navigate('/protected');
            }
        } catch (err) {
            console.log(err)
            setError(err.response);
        }
    }

    return (
        <section>
            <h1>Register</h1>
            {error && (<p>{error}</p>)}
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
                <button>Sign Up</button>
            </form>
            <p>
                Already registered?<br />
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