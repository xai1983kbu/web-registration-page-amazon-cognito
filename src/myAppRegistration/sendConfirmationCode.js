import React from 'react'
import { useForm } from 'react-hook-form'
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser
} from 'amazon-cognito-identity-js'

function doConfirm (data) {
  const { email, confirmafionCode } = data

  const poolData = {
    UserPoolId: process.env.REACT_APP_Pool_Id,
    ClientId: process.env.REACT_APP_App_client_Id
  }

  const userPool = new CognitoUserPool(poolData)

  var userData = {
    Username: email,
    Pool: userPool
  }

  var cognitoUser = new CognitoUser(userData)

  cognitoUser.confirmRegistration(confirmafionCode, true, function (
    err,
    result
  ) {
    if (err) {
      alert(err.message || JSON.stringify(err))
      return
    }
    console.log('call result: ' + result)
  })
}

function SendConfirmationCode () {
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = data => {
    console.log(data)
    doConfirm(data)
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
        placeholder='confirmafionCode'
        name='confirmafionCode'
        ref={register({
          required: true
        })}
      />
      {errors.confirmafionCode && errors.email.confirmafionCode}

      <button type='submit'>Confirm Registration</button>
    </form>
  )
}

export default SendConfirmationCode
