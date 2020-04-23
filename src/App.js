import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Register from './pages/Register'
import About from './pages/About'
import Home from './pages/Home'
import AddPlace from './pages/AddPlace'
import { useContext, useReducer } from 'react'
import Context from './context'
import reducer from './reducer'
import retriveUserFromLocalStorage from './utils/retriveUser'
import retrieveToken from './utils/retrieveToken'

// https://github.com/awslabs/aws-mobile-appsync-sdk-js
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync'
import AppSyncConfig from './aws-exports'
import { ApolloProvider } from 'react-apollo' // https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/456
// import { Rehydrated } from 'aws-appsync-react' // https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/115
import * as AWS from 'aws-sdk/global'

const client = new AWSAppSyncClient({
  url: AppSyncConfig.graphqlEndpoint,
  region: AppSyncConfig.region,
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    // apiKey: AppSyncConfig.apiKey
    jwtToken: async () => await retrieveToken()
  },
  // credentials: state.credentials

  disableOffline: true
})

export default function App () {
  const initialState = useContext(Context)
  const [state, dispatch] = useReducer(reducer, initialState)

  let token
  useEffect(() => {
    retriveUserFromLocalStorage(dispatch)
  }, [])

  return (
    <ApolloProvider client={client}>
      {/* <Rehydrated> */}
      <Router>
        <div>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/about'>About</Link>
            </li>
            <li>
              <Link to='/addplace'>Add Place</Link>
            </li>
            <li>
              <Link to='/register'>Register</Link>
            </li>
          </ul>

          <Context.Provider value={{ state, dispatch }}>
            <Switch>
              <Route path='/about'>
                <About />
              </Route>
              <Route path='/register'>
                <Register />
              </Route>
              <Route path='/addplace'>
                <AddPlace />
              </Route>
              <Route path='/'>
                <Home />
              </Route>
            </Switch>
          </Context.Provider>
        </div>
      </Router>
      {/* </Rehydrated> */}
    </ApolloProvider>
  )
}
