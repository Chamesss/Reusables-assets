import React, { useState } from 'react'
import { Link } from 'react-router-dom'


const Register = () => {

    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [matchPwd, setMatchPwd] = useState('')

    return (
        <section>
            <h1>Register</h1>
            <form>
                <label htmlFor="username">
                    Username:
                </label>
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