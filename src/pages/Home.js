import React, { useContext } from 'react'
import Context from '../context'

export default function Home () {
  const { state } = useContext(Context)

  return (
    <>
      <div>Home page</div>
      {state.currentUser && `Username: ${state.currentUser.username}`}
      {!state.currentUser && 'User not found'}
    </>
  )
}
