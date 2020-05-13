import React, { useState, useRef } from 'react'
import {
  TextField,
  Box,
  Button,
  Container,
  CssBaseline,
  Snackbar,
  CircularProgress,
  Typography
} from '@material-ui/core'

import MuiAlert from '@material-ui/lab/Alert'
import { useForm, Controller, ErrorMessage } from 'react-hook-form'
import {
  CognitoUserPool,
  // AuthenticationDetails,
  CognitoUser
} from 'amazon-cognito-identity-js'
import { useHistory, useLocation } from 'react-router-dom'
import Countdown from 'react-countdown'
// import * as AWS from 'aws-sdk/global' // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/creating-and-calling-service-objects.html
// import Context from '../../context'

function Alert (props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

// https://stackoverflow.com/a/56010951/9783262
function resetPassword (cognitoUser, verificationCode, newPassword) {
  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess () {
        // console.log('Password confirmed!')
        resolve('Password confirmed!')
      },
      onFailure (err) {
        // console.log('Password not confirmed!')
        reject(err)
      }
    })
  })
}

async function doResetPassword (data, email) {
  // console.log(email)
  const { code, password1 } = data
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
  try {
    const result = await resetPassword(cognitoUser, code, password1)
    return {
      success: result
    }
  } catch (err) {
    return {
      error: err.message || JSON.stringify(err)
    }
  }
}

export default function ResetPassword () {
  // const { dispatch } = useContext(Context)
  const {
    errors,
    // register,
    handleSubmit,
    control,
    setError,
    // triggerValidation,
    watch
  } = useForm({ mode: 'onChange' }) //	Validation will trigger on the change event with each input, and lead to multiple re-renders. Warning: this often comes with a significant impact on performances.
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  let history = useHistory()
  let location = useLocation()

  // https://codesandbox.io/s/react-hook-form-password-match-check-standard-validation-eo6en?from-embed
  const password = useRef({})
  password.current = watch('password1', '')

  const onSubmit = async data => {
    setIsSubmitting(true)
    const userEmail = location.state && location.state.codeDeliveryEmail
    const email = location.state && location.state.email
    const resetPasswordResult = await doResetPassword(data, email)
    console.log(resetPasswordResult)
    if (resetPasswordResult.success) {
      setErrorMessage(false)
      setSuccessMessage(
        `Password for user with email ${userEmail} was successfully changed!`
      )
    } else if (resetPasswordResult.error) {
      setErrorMessage(`${resetPasswordResult.error}`)
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
            successMessage && history.push('/register/signin')
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
        <Typography variant='h6' component='h2'>
          We have sent a password reset code by email to{' '}
          {location.state && location.state.codeDeliveryEmail}. Enter it below
          to reset your password.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            as={
              <TextField
                fullWidth
                margin='none'
                id='outlined-code-input'
                label='Code'
                type='text'
                variant='outlined'
              />
            }
            control={control}
            name='code'
            defaultValue=''
            rules={{
              required: 'This is required.',
              pattern: {
                value: /^[0-9]{6,6}$/,
                message: 'Must contain 6-digit number'
              }
            }}
          />
          <ErrorMessage errors={errors} name='code' />
          <Box component='div' m={1} defaultValue='' />
          <Controller
            as={
              <TextField
                fullWidth
                id='outlined-password-input-1'
                label='New Password'
                type='password'
                variant='outlined'
              />
            }
            control={control}
            name='password1'
            defaultValue=''
            rules={{
              // https://stackoverflow.com/questions/58767980/aws-cognito-password-regex
              validate: password => {
                if (!/^(?=.*[A-Z])/.test(password)) {
                  setError(
                    'password1',
                    'isUpper',
                    'Must contain at least 1 Uppercase alphabetical character'
                  )
                  return false
                } else if (!/^(?=.*[a-z])/.test(password)) {
                  setError(
                    'password1',
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
                    'password1',
                    'isSpetial',
                    `The password must contain at least one Special character ^ $ * . [ ] { } ( ) ? - " ! @ # % & / \ , > < ' : ; | _ ~ `
                  )
                  return false
                } else if (!/.{6,99}/.test(password)) {
                  setError(
                    'password1',
                    'isMinLen',
                    'Must contain at least 6 characters'
                  )
                  return false
                }
                return true
              }
            }}
          />
          <ErrorMessage errors={errors} name='password1' />
          <Box component='div' m={1} defaultValue='' />
          <Controller
            as={
              <TextField
                fullWidth
                id='outlined-password-input-2'
                label='Enter New Password Again'
                type='password'
                variant='outlined'
              />
            }
            control={control}
            name='password2'
            defaultValue=''
            rules={{
              validate: value =>
                value === password.current || 'The passwords do not match'
            }}
          />
          <ErrorMessage errors={errors} name='password2' />
          <Box component='div' m={1} defaultValue='' />
          <Button
            type='submit'
            fullWidth
            size='large'
            variant='contained'
            color='primary'
            disabled={isSubmitting}
          >
            Reset Password
          </Button>
        </form>
      </Container>
    </React.Fragment>
  )
}
