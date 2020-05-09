import React, { useContext } from 'react'
import Context from '../context'
import Header from '../components/ui/Header'

export default function Home () {
  const { state } = useContext(Context)

  return (
    <>
      <Header />
      <div style={{ marginTop: '80px' }} />
      <div>Home page</div>
      {state.currentUser && `Username: ${state.currentUser.username}`}
      {!state.currentUser && 'User not found'}
    </>
  )
}
