import * as AWS from 'aws-sdk/global'

export default function reffreshIdToken (session, cognitoUser, dispatch) {
  const refresh_token = session.getRefreshToken() // receive session from calling cognitoUser.getSession()
  AWS.config.region = process.env.REACT_APP_Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.REACT_APP_Identity_pool_Id, // your identity pool id here
    Logins: {
      // Change the key below according to the specific region your user pool is in.
      [`cognito-idp.${process.env.REACT_APP_Region}.amazonaws.com/${process.env.REACT_APP_Pool_Id}`]: session
        .getIdToken()
        .getJwtToken()
    }
  })

  // console.log(AWS.config.credentials)
  if (AWS.config.credentials.needsRefresh()) {
    cognitoUser.refreshSession(refresh_token, (err, session) => {
      if (err) {
        console.log(err)
      } else {
        AWS.config.credentials.params.Logins[
          `cognito-idp.${process.env.REACT_APP_Region}.amazonaws.com/${process.env.REACT_APP_Pool_Id}`
        ] = session.getIdToken().getJwtToken()
        AWS.config.credentials.refresh(err => {
          if (err) {
            console.log(err)
          } else {
            dispatch({
              type: 'GET_CREDENTIALS',
              payload: {
                identity_creds: AWS.config.credentials
              }
            })
            console.log('TOKEN SUCCESSFULLY UPDATED')
          }
        })
      }
    })
  }
}
