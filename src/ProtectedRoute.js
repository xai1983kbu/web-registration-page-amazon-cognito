import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Context from './context'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(Context)
  console.log('inside protected Route')
  return (
    <Route
      render={props =>
        !state.isAuth ? <Redirect to='/register' /> : <Component {...props} />
      }
      {...rest}
    />
  )
}

export default ProtectedRoute
