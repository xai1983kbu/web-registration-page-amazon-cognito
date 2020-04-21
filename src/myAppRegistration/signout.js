import React from 'react'
import { useForm } from 'react-hook-form'
import { CognitoUserPool } from 'amazon-cognito-identity-js'

function doSignout () {
  const poolData = {
    UserPoolId: process.env.REACT_APP_Pool_Id,
    ClientId: process.env.REACT_APP_App_client_Id
  }

  const userPool = new CognitoUserPool(poolData)
  const cognitoUser = userPool.getCurrentUser()
  if (cognitoUser !== null) {
    cognitoUser.signOut()
  } else {
    console.log('User is already signout')
  }
}

function Signout () {
  const { handleSubmit } = useForm()
  const onSubmit = data => {
    doSignout()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button type='submit'>Signout</button>
    </form>
  )
}

export default Signout
