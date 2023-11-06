import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom';

const Login = () => {
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
  return (
    <section>
            <h1>Sign In</h1>
            <form>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>
  )
}

export default Login