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
            } catch (err) {
                console.log(err);
            }
        }
        getUsers();
    }, [])

    const handleNavigation = (receiverId) => {
        navigate(`/protected/userslist/messages/${receiverId}`);
    }

    return (
        <div>
            {users.map(user => {
                return (
                    <div key={user._id}>
                        <span>{user.firstName}</span>
                        {user.status && <span> (Online)</span>}
                        <button onClick={() => handleNavigation(user._id)}>Send msg!</button>
                        <br />
                    </div>
                )
            })}
        </div>
    )
}

export default UsersList