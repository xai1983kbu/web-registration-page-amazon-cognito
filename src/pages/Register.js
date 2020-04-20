import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from 'react-router-dom'
import SignIn from './registration/SignIn'
import SignUp from './registration/SignUp'
import Confirm from './registration/Confirm'
import ResendCode from './registration/ResendCode'

export default function Register () {
  let match = useRouteMatch()

  return (
    <div>
      <h2>Register</h2>

      <ul>
        <li>
          <Link to={`${match.url}/signup`}>SignUp</Link>
        </li>
        <li>
          <Link to={`${match.url}/signin`}>SignIn</Link>
        </li>
        <li>
          <Link to={`${match.url}/signout`}>SignOut</Link>
        </li>
        <li>
          <Link to={`${match.url}/confirm`}>Confirm</Link>
        </li>
        <li>
          <Link to={`${match.url}/resendcode`}>Resend Code</Link>
        </li>
      </ul>

      <Switch>
        <Route path={`${match.url}/signup`}>
          <SignUp />
        </Route>
        <Route path={`${match.url}/signin`}>
          <SignIn />
        </Route>
        <Route path={`${match.url}/signout`}>
          <SignIn />
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
