import React, { useState, useContext } from 'react'
import {
  Button,
  Container,
  CssBaseline,
  Snackbar,
  CircularProgress
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { useForm, Controller, ErrorMessage } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import Countdown from 'react-countdown'
import Context from '../../context'
import { CognitoUser } from 'amazon-cognito-identity-js'

function Alert (props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

export default function SignOut () {
  const { state, dispatch } = useContext(Context)
  const { handleSubmit } = useForm()
  let history = useHistory()

  const onSubmit = async () => {
    const cognitoUser = state.currentUser
    if (cognitoUser instanceof CognitoUser) {
      const signoutResult = await cognitoUser.signOut()
      console.log(signoutResult)
    }
    dispatch({ type: 'LOGOUT_USER', payload: { currentUser: null } })
    history.push('/home')
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='xs' style={{ textAlign: 'center' }}>
        {/* <Snackbar
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
        {isSubmitting && <CircularProgress />} */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Button
            type='submit'
            fullWidth
            size='large'
            variant='contained'
            color='primary'
            // disabled={isSubmitting}
          >
            SignOut
          </Button>
        </form>
      </Container>
    </React.Fragment>
  )
}
