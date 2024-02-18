import React from 'react'
import useRedirectLoggedOutUser from '../customHook/useRedirectLoggedOutUser'

const LoggedinTimeCheck = () => {
    useRedirectLoggedOutUser('/login');
  return (
    <div>
      LoggedinTimeCheck
    </div>
  )
}

export default LoggedinTimeCheck
