import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <h1 className='centered'>Welcome page</h1>
        <Link to="/login" className='type'>Sign in !</Link>
    </div>
  )
}

export default Home