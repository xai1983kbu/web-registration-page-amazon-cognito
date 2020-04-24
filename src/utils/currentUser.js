import { CognitoUserPool } from 'amazon-cognito-identity-js'
import * as AWS from 'aws-sdk/global' // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/creating-and-calling-service-objects.html

// https://stackoverflow.com/a/56010951/9783262
export default function retriveUserToken (dispatch) {
  // console.log('inside function retriveUserFromLocalStorage')
  return new Promise((resolve, reject) => {
    const poolData = {
      UserPoolId: process.env.REACT_APP_Pool_Id,
      ClientId: process.env.REACT_APP_App_client_Id
    }
    const userPool = new CognitoUserPool(poolData)

    const cognitoUser = userPool.getCurrentUser()

    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          // alert(err.message || JSON.stringify(err))
          reject(err)
          return
        }
        console.log('session validity: ' + session.isValid())
        // console.log(session)

        // resolve(session.getIdToken().getJwtToken())

        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
        cognitoUser.getUserAttributes(function (err, attributes) {
          if (err) {
            // Handle error
          } else {
            // Do something with attributes
          }
        })

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: process.env.REACT_APP_Identity_pool_Id, // your identity pool id here
          Logins: {
            // Change the key below according to the specific region your user pool is in.
            [`cognito-idp.${process.env.REACT_APP_Region}.amazonaws.com/${process.env.REACT_APP_Pool_Id}`]: session
              .getIdToken()
              .getJwtToken()
          }
        })

        // Instantiate aws sdk service objects now that the credentials have been updated.
        // example: var s3 = new AWS.S3();
        dispatch({
          type: 'RETRIEVE_USER_FROM_LOCAL',
          payload: {
            currentUser: cognitoUser
          }
        })
        dispatch({
          type: 'IS_LOGGED_IN',
          payload: {
            isAuth: true
          }
        })
        resolve(session.getIdToken().getJwtToken())
      })
    }
  }).catch(err => {
    console.log('Catch block - retriveUserFromLocalStorage')
    console.log(err)
    dispatch({
      type: 'IS_LOGGED_IN',
      payload: {
        isAuth: false
      }
    })
  })
}
