import React from 'react'
import { useForm } from 'react-hook-form'
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser
} from 'amazon-cognito-identity-js'

function doRegister (data) {
  const { email, username, password } = data

  const poolData = {
    UserPoolId: process.env.REACT_APP_Pool_Id,
    ClientId: process.env.REACT_APP_App_client_Id
  }

  const userPool = new CognitoUserPool(poolData)

  let attributeList = []

  const dataEmail = {
    Name: 'email',
    Value: email
  }

  const dataUsername = {
    Name: 'name',
    Value: username
  }

  const attributeEmail = new CognitoUserAttribute(dataEmail)
  const attributeUsername = new CognitoUserAttribute(dataUsername)

  attributeList.push(attributeEmail)
  attributeList.push(attributeUsername)

  userPool.signUp(email, password, attributeList, null, function (err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err))
      return
    }
    var cognitoUser = result.user
    console.log('user name is ' + cognitoUser.getUsername())
  })

  console.log('Register User ', userPool)
}

function Register () {
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = data => {
    doRegister(data)
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

      <input placeholder='username' name='username' ref={register({})} />
      {errors.username && errors.username.message}

      <input
        placeholder='password'
        name='password'
        ref={register({ required: true })}
      />
      {errors.password && errors.password.message}

      <button type='submit'>Register</button>
    </form>
  )
}

export default Register
