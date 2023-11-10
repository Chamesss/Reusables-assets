import React from 'react'
import SyncLoader from "react-spinners/SyncLoader";


const Spinner = () => {
    return (
        <div className='loading'>
            <SyncLoader />
        </div>
    )
}

export default Spinner