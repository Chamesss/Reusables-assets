import React, { useState }  from 'react'
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
                <input
                    type="text"
                    id="username"
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />
                <label htmlFor="password">
                    Password:
                </label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <label htmlFor="confirm_pwd">
                    Confirm Password:
                </label>
                <input
                    type="password"
                    id="confirm_pwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                />
                <button>Sign Up</button>
            </form>
            <p>
                Already registered?<br />
                <span className="line">
                    <Link to="/">Sign In</Link>
                </span>
            </p>
        </section>
    )
}

export default Register