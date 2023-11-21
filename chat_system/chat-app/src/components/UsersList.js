import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../api/UserApi'

const UsersList = () => {

    const navigate = useNavigate();

    const getUsersQuery = useQuery({
        queryKey:['getUsers'],
        queryFn: getUsers
    })

    const handleNavigation = (receiver_id) => {
        navigate(`/protected/userslist/messages/${receiver_id}`);
    }

    return (
        <div>
            {getUsersQuery.data?.map(user => {
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