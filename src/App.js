import React from 'react'
import logo from './logo.svg'
import './App.css'
import Register from './myAppRegistration/register'
import SendConfirmationCode from './myAppRegistration/sendConfirmationCode'
import ResendConfirmationCode from './myAppRegistration/resendConfirmationCode'
import Login from './myAppRegistration/login'
import GetCurrentUserFromLocalStorage from './myAppRegistration/getCurrentUserFromLocalStorage'
import Signout from './myAppRegistration/signout'

function App () {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
        <Register />
        <SendConfirmationCode />
        <ResendConfirmationCode />
        <Login />
        <br />
        <GetCurrentUserFromLocalStorage />
        <Signout />
      </header>
    </div>
  )
}

export default App
