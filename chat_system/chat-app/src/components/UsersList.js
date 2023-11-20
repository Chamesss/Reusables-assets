import React, { useEffect, useState } from 'react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'

const UsersList = () => {

    const [users, setUsers] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get('/user/allusers');
                setUsers(response.data)
                console.log(response.data)
            } catch (err) {
                console.log(err);
            }
        }
        getUsers();
    }, [])

    const handleNavigation = (receiver_id) => {
        navigate(`/protected/userslist/messages/${receiver_id}`);
    }

    return (
        <div>
            {users.map(user => {
                return (
                    <div key={user._id}>
                        <span>{user.firstName}</span>
                        {user.status && <span>{user.status}</span>}
                        <button onClick={() => handleNavigation(user._id)}>Send msg!</button>
                        <br />
                        {console.log(user)}
                    </div>
                )
            })}
        </div>
    )
}

export default UsersList