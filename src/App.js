import React, { useRef } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Register from './pages/Register'
import About from './pages/About'
import Home from './pages/Home'
import AddPlace from './pages/AddPlace'
import SearchPlace from './pages/SearchPlace'
import { useContext, useReducer } from 'react'
import Context from './context'
import reducer from './reducer'
import retriveUserToken, { retriveJwtToken } from './utils/currentUser'

// https://github.com/awslabs/aws-mobile-appsync-sdk-js
import { AUTH_TYPE, createAppSyncLink } from 'aws-appsync'
import AppSyncConfig from './aws-exports'

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo' // https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/456
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
// import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks' // https://www.gravitywell.co.uk/insights/react-apollo-and-react-hooks-a-match-made-in-heaven/
// import { Rehydrated } from 'aws-appsync-react' // https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/115
// import * as AWS from 'aws-sdk/global'
import ProtectedRoute from './ProtectedRoute'
import { ThemeProvider } from '@material-ui/styles'
import theme from './components/ui/Theme'

const httpLink = new HttpLink({
  uri: AppSyncConfig.graphqlEndpoint
})

const getAwsLink = () =>
  createAppSyncLink({
    url: AppSyncConfig.graphqlEndpoint,
    region: AppSyncConfig.region,
    auth: {
      type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      jwtToken: async () => await retriveJwtToken()
    }
  })

// https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/450#issuecomment-529521768
let client

export default function App () {
  const initialState = useContext(Context)
  const [state, dispatch] = useReducer(reducer, initialState)

  // Creating client which recieve dispatch.
  // Simulation willMount life cycle method in functional component
  // https://stackoverflow.com/questions/53464595/how-to-use-componentwillmount-in-react-hooks
  const willMount = useRef(true)
  if (willMount.current) {
    // console.log('This runs only once before rendering the component.')
    willMount.current = false
    retriveUserToken(dispatch)
    const awsLink = getAwsLink()
    client = new ApolloClient({
      link: awsLink.concat(httpLink),
      cache: new InMemoryCache()
    })
  }

  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        {/* <Rehydrated> */}
        <ThemeProvider theme={theme}>
          <Router>
            <div>
              {/* <ul>
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
          </ul> */}

              <Context.Provider value={{ state, dispatch }}>
                <Switch>
                  <Route path='/about' component={About} />
                  <Route path='/register' component={Register} />
                  <Route path='/addplace' component={AddPlace} />
                  <ProtectedRoute path='/searchplace' component={SearchPlace} />
                  <Route path='/' component={Home} />
                </Switch>
              </Context.Provider>
            </div>
          </Router>
        </ThemeProvider>
        {/* </Rehydrated> */}
      </ApolloHooksProvider>
    </ApolloProvider>
  )
}
