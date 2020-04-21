import { createContext } from 'react'

const Context = createContext({
  currentUser: null,
  credentials: null
})

export default Context
