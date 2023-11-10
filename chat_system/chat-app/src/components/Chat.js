import React from 'react'
import { useParams } from 'react-router-dom';

const Chat = () => {
    const { recieverId } = useParams();
    return (
        <div>
            <p>Received id: {recieverId}</p>
            <p>building in progress...</p>
        </div>
    )
}

export default Chat