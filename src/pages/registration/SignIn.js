import React, { useState, useContext } from 'react'
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
  AuthenticationDetails,
  CognitoUser
} from 'amazon-cognito-identity-js'
import { useHistory } from 'react-router-dom'
import Countdown from 'react-countdown'
import * as AWS from 'aws-sdk/global' // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/creating-and-calling-service-objects.html
import Context from '../../context'

function Alert (props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

// https://stackoverflow.com/a/56010951/9783262
function loginUser (cognitoUser, authenticationDetails, dispatch) {
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        dispatch({ type: 'LOGIN_USER', payload: { currentUser: cognitoUser } })
        const accessToken = result.getAccessToken().getJwtToken()

        //POTENTIAL: Region needs to be set if not already set previously elsewhere.
        AWS.config.region = process.env.REACT_APP_Region

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: process.env.REACT_APP_Identity_pool_Id, // your identity pool id here
          Logins: {
            // Change the key below according to the specific region your user pool is in.
            [`cognito-idp.${process.env.REACT_APP_Region}.amazonaws.com/${process.env.REACT_APP_Pool_Id}`]: result
              .getIdToken()
              .getJwtToken()
          }
        })

        // https://forums.aws.amazon.com/thread.jspa?threadID=243850
        AWS.config.credentials.clearCachedId()
        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh(error => {
          if (error) {
            // console.error(error)
            reject({ error: error })
          } else {
            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();
            console.log('Successfully logged!')
            resolve({ success: 'Successfully logged! (refresh token)' })
          }
        })
      },

      onFailure: function (err) {
        // alert(err.message || JSON.stringify(err))
        reject(err)
      }
    })
  })
}

async function doLogin (data, dispatch) {
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

  try {
    await loginUser(cognitoUser, authenticationDetails, dispatch)
    return {
      success: 'SUCCESS'
    }
  } catch (err) {
    return {
      error: err.message || JSON.stringify(err)
    }
  }
}

export default function SignIn () {
  const { dispatch } = useContext(Context)

  const {
    errors,
    register,
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
    const { email } = data
    setIsSubmitting(true)
    const loginResult = await doLogin(data, dispatch)
    // console.log(loginResult)
    if (loginResult.success) {
      setErrorMessage(false)
      setSuccessMessage(`User ${email} is successfully Signed In!`)
    } else if (loginResult.error) {
      setErrorMessage(`${loginResult.error}`)
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
            successMessage && history.push('/home')
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
            SignIn
          </Button>
        </form>
      </Container>
    </React.Fragment>
  )
}
