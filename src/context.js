import { createContext } from 'react'

const Context = createContext({
  currentUser: null,
  identity_creds: null,
  isAuth: false,
  draft: null,
  pins: []
})

export default Context
