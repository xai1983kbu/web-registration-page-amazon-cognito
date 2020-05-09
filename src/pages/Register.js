import React, { useContext } from 'react'
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom'
import SignIn from './registration/SignIn'
import SignUp from './registration/SignUp'
import Confirm from './registration/Confirm'
import ResendCode from './registration/ResendCode'
import SignOut from './registration/SignOut'
import ResetPassword from './registration/ResetPassword'
import ForgotPassword from './registration/ForgotPassword'
import Context from './../context'
import { Typography } from '@material-ui/core'
import Header from '../components/ui/Header'

export default function Register () {
  let match = useRouteMatch()
  const { state } = useContext(Context)

  return (
    <div>
      <Header />
      <div style={{ marginTop: '40px' }} />
      <Typography variant='h5' component='h2'>
        Register
      </Typography>

      <ul>
        {!state.currentUser && (
          <>
            <li>
              <Link to={`${match.url}/signup`}>SignUp</Link>
            </li>
            <li>
              <Link to={`${match.url}/signin`}>SignIn</Link>
            </li>
            <li>
              <Link to={`${match.url}/forgotpassword`}>Forgot Password</Link>
            </li>
            <li>
              <Link to={`${match.url}/resetpassword`}>Reset Password</Link>
            </li>
            <li>
              <Link to={`${match.url}/confirm`}>Confirm</Link>
            </li>
            <li>
              <Link to={`${match.url}/resendcode`}>Resend Code</Link>
            </li>
          </>
        )}
        {state.currentUser && (
          <li>
            <Link to={`${match.url}/signout`}>SignOut</Link>
          </li>
        )}
      </ul>

      <Switch>
        <Route path={`${match.url}/signup`}>
          <SignUp />
        </Route>
        <Route path={`${match.url}/signin`}>
          <SignIn />
        </Route>
        <Route path={`${match.url}/forgotpassword`}>
          <ForgotPassword />
        </Route>
        <Route path={`${match.url}/resetpassword`}>
          <ResetPassword />
        </Route>
        <Route path={`${match.url}/signout`}>
          <SignOut />
        </Route>
        <Route path={`${match.url}/confirm`}>
          <Confirm />
        </Route>
        <Route path={`${match.url}/resendcode`}>
          <ResendCode />
        </Route>
      </Switch>
    </div>
  )
}
