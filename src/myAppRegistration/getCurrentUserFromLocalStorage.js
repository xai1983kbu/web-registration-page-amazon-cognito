import React from 'react'
import { useForm } from 'react-hook-form'
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser
} from 'amazon-cognito-identity-js'

function doRetriveCurentUser () {
  const poolData = {
    UserPoolId: process.env.REACT_APP_Pool_Id,
    ClientId: process.env.REACT_APP_App_client_Id
  }

  const userPool = new CognitoUserPool(poolData)
  const cognitoUser = userPool.getCurrentUser()

  if (cognitoUser != null) {
    cognitoUser.getSession(function (err, session) {
      if (err) {
        alert(err.message || JSON.stringify(err))
        return
      }
      console.log('session validity: ' + session.isValid())

      // NOTE: getSession must be called to authenticate user before calling getUserAttributes
      cognitoUser.getUserAttributes(function (err, attributes) {
        if (err) {
          // Handle error
        } else {
          console.log(attributes)
          // Do something with attributes
        }
      })

      // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      //   IdentityPoolId: '...', // your identity pool id here
      //   Logins: {
      //     // Change the key below according to the specific region your user pool is in.
      //     'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': session
      //       .getIdToken()
      //       .getJwtToken()
      //   }
      // })

      // Instantiate aws sdk service objects now that the credentials have been updated.
      // example: var s3 = new AWS.S3();
    })
  } else {
    console.log('You have to sigin first')
  }
}

function GetCurrentUserFromLocalStorage () {
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = data => {
    doRetriveCurentUser()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button type='submit'>Retrive current user from local storage</button>
    </form>
  )
}

export default GetCurrentUserFromLocalStorage
