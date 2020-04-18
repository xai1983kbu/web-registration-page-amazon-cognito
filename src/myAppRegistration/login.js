import React from 'react'
import { useForm } from 'react-hook-form'
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser
} from 'amazon-cognito-identity-js'

function doLogin (data) {
  const { email, password } = data

  const authenticationData = {
    Username: email,
    Password: password
  }

  const authenticationDetails = new AuthenticationDetails(authenticationData)

  const poolData = {
    UserPoolId: process.env.REACT_APP_Pool_Id,
    ClientId: process.env.REACT_APP_App_client_Id
  }

  const userPool = new CognitoUserPool(poolData)
  const userData = {
    Username: email,
    Pool: userPool
  }
  const cognitoUser = new CognitoUser(userData)
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      const accessToken = result.getAccessToken().getJwtToken()
      console.log(accessToken)

      //POTENTIAL: Region needs to be set if not already set previously elsewhere.
      // AWS.config.region = process.env.REACT_APP_Region

      // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      //   IdentityPoolId: process.env.REACT_APP_Identity_pool_Id, // your identity pool id here
      //   Logins: {
      //     // Change the key below according to the specific region your user pool is in.
      //     [`cognito-idp.${process.env.REACT_APP_Region}.amazonaws.com/${process.env.REACT_APP_Pool_Id}`]: result
      //       .getIdToken()
      //       .getJwtToken()
      //   }
      // })

      //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
      // AWS.config.credentials.refresh(error => {
      //   if (error) {
      //     console.error(error)
      //   } else {
      //     // Instantiate aws sdk service objects now that the credentials have been updated.
      //     // example: var s3 = new AWS.S3();
      //     console.log('Successfully logged!')
      //   }
      // })
    },

    onFailure: function (err) {
      alert(err.message || JSON.stringify(err))
    }
  })
}

function Login () {
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = data => {
    doLogin(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        placeholder='email'
        name='email'
        ref={register({
          required: true,
          patternpattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: 'invalid email address'
          }
        })}
      />
      {errors.email && errors.email.message}

      <input
        placeholder='password'
        name='password'
        ref={register({ required: true })}
      />
      {errors.password && errors.password.message}

      <button type='submit'>Login</button>
    </form>
  )
}

export default Login
