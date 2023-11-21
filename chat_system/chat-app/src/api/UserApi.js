import axios from './axios'

const registerUser = async (data) => {
    try {
        const response = await axios.post('/user/createuser', {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.pwd
        })
        return response.data
    } catch {
        throw new Error("Registration failed.")
    }
}

const login = async (data) => {
    try {
        const response = await axios.post('/user/login',
            JSON.stringify({ firstName: data.user, password: data.pwd }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        return response.data
    } catch (error) {
        throw new Error(error.response.data)
    }
}

export { registerUser, login }