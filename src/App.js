import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Register from './pages/Register'
import About from './pages/About'
import Home from './pages/Home'

export default function App () {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
          <li>
            <Link to='/register'>Register</Link>
          </li>
        </ul>

        <Switch>
          <Route path='/about'>
            <About />
          </Route>
          <Route path='/register'>
            <Register />
          </Route>
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
