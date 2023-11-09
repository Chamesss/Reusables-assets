import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Home = () => {
  const { auth } = useAuth();

  useEffect(() => {

  }, [])

  return (
    <div>
      <h1 className='centered'>Welcome page</h1>
      {!auth.accessToken && !auth.user &&
        (
          <div>
            <Link to="/login" className='type'>Sign in !</Link>
            <br />
            <Link to="/register" className='type'>Register</Link>
          </div>
        )}
        {auth.accessToken && auth.user &&
        (
          <div>
            <Link to="/protected" className='type'>Action Page</Link>
          </div>
        )}
    </div>
  )
}

export default Home