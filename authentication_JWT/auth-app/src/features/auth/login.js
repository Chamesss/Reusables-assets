import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";

const Login = () => {
    const userRef = useRef()
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const userData = await login({ firstName: user, password: pwd }).unwrap()
            console.log(userData);
            dispatch(setCredentials({ ...userData }))
            setUser('')
            setPwd('')
            navigate('/welcome')
        } catch (err) {
            if (err.originalStatus === null) {
                setErrMsg('No server Response')
            } else if (err.originalStatus === 401) {
                setErrMsg('Missing username or password')
            } else if (err.originalStatus === 500) {
                setErrMsg('Login failed.');
            } else {
                setErrMsg('Login failed.')
            }
        }
    }

    const handleUserInput = (e) => setUser(e.target.value)
    const handlePwdInput = (e) => setPwd(e.target.value)

    const content = isLoading ? <h1>Loading...</h1> : (
        <div>
            <section>
                {errMsg && <p>{errMsg}</p>}
                <h1>User Login</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type='text'
                        id='username'
                        ref={userRef}
                        value={user}
                        onChange={handleUserInput}
                        autoComplete='off'
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type='password'
                        id='password'
                        onChange={handlePwdInput}
                        value={pwd}
                        required
                    />
                    <button>Sign In</button>
                </form>
            </section>
        </div>
    )
    return content
}

export default Login