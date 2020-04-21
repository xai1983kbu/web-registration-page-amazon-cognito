import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  TextField,
  Box,
  Button,
  Container,
  CssBaseline,
  Snackbar,
  CircularProgress
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { useForm, Controller, ErrorMessage } from 'react-hook-form'
import {
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js'
import { useHistory } from 'react-router-dom'
import Countdown from 'react-countdown'

function Alert (props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

// https://stackoverflow.com/a/56010951/9783262
function registerUser (userPool, email, password, attribute_list) {
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attribute_list, null, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      const cognitoUser = result.user
      resolve(cognitoUser)
    })
  })
}

async function doRegister (data) {
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

  try {
    const cognitoUser = await registerUser(
      userPool,
      email,
      password,
      attributeList
    )
    return {
      success: cognitoUser.getUsername()
    }
  } catch (err) {
    return {
      error: err.message || JSON.stringify(err)
    }
  }
}

export default function SignUp () {
  const {
    errors,
    handleSubmit,
    control,
    setError,
    triggerValidation
  } = useForm({ mode: 'onChange' }) //	Validation will trigger on the change event with each input, and lead to multiple re-renders. Warning: this often comes with a significant impact on performances.
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  let history = useHistory()

  const onSubmit = async data => {
    setIsSubmitting(true)
    const regResult = await doRegister(data)
    // console.log(regResult)
    if (regResult.success) {
      setErrorMessage(false)
      setSuccessMessage(
        `User ${regResult.success} is successfully registered! You need to confirm registration.`
      )
    } else if (regResult.error) {
      setErrorMessage(`${regResult.error}`)
      setSuccessMessage(false)
    }
    setOpen(true)
    setIsSubmitting(false)
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='xs' style={{ textAlign: 'center' }}>
        <Snackbar
          open={open}
          autoHideDuration={errorMessage ? 20000 : 5000}
          onClose={() => {
            setOpen(false)
            successMessage && history.push('/register/confirm')
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          {errorMessage ? (
            <Alert onClose={() => setOpen(false)} severity='error'>
              {errorMessage}
            </Alert>
          ) : (
            <Alert onClose={() => setOpen(false)} severity='success'>
              {successMessage}
              <Countdown
                date={Date.now() + 5000}
                intervalDelay={1000}
                precision={0}
                renderer={props => <div>Wait {props.total / 1000} sec</div>}
              />
            </Alert>
          )}
        </Snackbar>
        {isSubmitting && <CircularProgress />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            as={
              <TextField
                fullWidth
                margin='none'
                id='outlined-email-input'
                label='Email'
                type='email'
                variant='outlined'
              />
            }
            control={control}
            name='email'
            defaultValue=''
            rules={{
              required: 'This is required.',
              // https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression
              pattern: {
                value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                message: 'Must contain valid email address!'
              }
            }}
          />
          <ErrorMessage errors={errors} name='email' />
          <Box component='div' m={1} defaultValue='' />
          <Controller
            as={
              <TextField
                fullWidth
                margin='none'
                id='outlined-username-input'
                label='Username'
                type='text'
                variant='outlined'
              />
            }
            onFocus={triggerValidation('password')}
            control={control}
            name='username'
            defaultValue=''
            rules={{
              required: 'This is required.',
              minLength: {
                value: 6,
                message: 'Min length of username 6 chars'
              }
            }}
          />
          <ErrorMessage errors={errors} name='username' />
          <Box component='div' m={1} defaultValue='' />
          <Controller
            as={
              <TextField
                fullWidth
                id='outlined-password-input'
                label='Password'
                type='password'
                variant='outlined'
              />
            }
            control={control}
            name='password'
            defaultValue=''
            rules={{
              // https://stackoverflow.com/questions/58767980/aws-cognito-password-regex
              validate: password => {
                if (!/^(?=.*[A-Z])/.test(password)) {
                  setError(
                    'password',
                    'isUpper',
                    'Must contain at least 1 Uppercase alphabetical character'
                  )
                  return false
                } else if (!/^(?=.*[a-z])/.test(password)) {
                  setError(
                    'password',
                    'isUpper',
                    'Must contain at least 1 Lowercase alphabetical character'
                  )
                  return false
                } else if (
                  !/^(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&/,><\’:;|_~`])/.test(
                    password
                  )
                ) {
                  setError(
                    'password',
                    'isSpetial',
                    `The password must contain at least one Special character ^ $ * . [ ] { } ( ) ? - " ! @ # % & / \ , > < ' : ; | _ ~ `
                  )
                  return false
                } else if (!/.{6,99}/.test(password)) {
                  setError(
                    'password',
                    'isMinLen',
                    'Must contain at least 6 characters'
                  )
                  return false
                }
                return true
              }
            }}
          />
          <ErrorMessage errors={errors} name='password' />
          <Box component='div' m={1} defaultValue='' />
          <Button
            type='submit'
            fullWidth
            size='large'
            variant='contained'
            color='primary'
            disabled={isSubmitting}
          >
            SignUp
          </Button>
        </form>
      </Container>
    </React.Fragment>
  )
}
