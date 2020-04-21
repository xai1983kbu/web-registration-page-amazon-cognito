import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Register from './pages/Register'
import About from './pages/About'
import Home from './pages/Home'
import { useContext, useReducer } from 'react'
import Context from './context'
import reducer from './reducer'
import retriveUserFromLocalStorage from './utils/retriveUser'

export default function App () {
  const initialState = useContext(Context)
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    retriveUserFromLocalStorage(dispatch)
  }, [])

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

        <Context.Provider value={{ state, dispatch }}>
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
        </Context.Provider>
      </div>
    </Router>
  )
}
