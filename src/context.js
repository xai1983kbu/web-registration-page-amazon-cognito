import { createContext } from 'react'

const Context = createContext({
  currentUser: null,
  isAuth: false,
  dreaft: null
})

export default Context
