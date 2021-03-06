import React, { useState } from 'react'
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
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'
import { useHistory } from 'react-router-dom'
import Countdown from 'react-countdown'

function Alert (props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

// https://stackoverflow.com/a/56010951/9783262
function confirmUser (cognitoUser, code) {
  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, function (err, result) {
      if (err) {
        // alert(err.message || JSON.stringify(err))
        reject(err)
        return
      }
      // console.log('call result: ' + result)
      resolve(result)
    })
  })
}

async function doConfirm (data) {
  const { email, code } = data
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
    const result = await confirmUser(cognitoUser, code)
    return {
      success: result
    }
  } catch (err) {
    return {
      error: err.message || JSON.stringify(err)
    }
  }
}

export default function Confirm () {
  const { handleSubmit, errors, control } = useForm({ mode: 'onChange' })
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  let history = useHistory()

  const onSubmit = async data => {
    const { email } = data
    setIsSubmitting(true)
    const confirmResult = await doConfirm(data)
    if (confirmResult.success) {
      setErrorMessage(false)
      setSuccessMessage(
        `User ${email} is successfully confirmed! You can login now!`
      )
    } else if (confirmResult.error) {
      setErrorMessage(`${confirmResult.error}`)
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
                id='outlined-code-input'
                label='Confirmation Code'
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
          <Button
            type='submit'
            fullWidth
            size='large'
            variant='contained'
            color='primary'
            disabled={isSubmitting}
          >
            Confirm
          </Button>
        </form>
      </Container>
    </React.Fragment>
  )
}
