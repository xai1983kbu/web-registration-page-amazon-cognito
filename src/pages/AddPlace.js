import React from 'react'
// import gql from 'graphql-tag'
// import { Query, Mutation } from 'react-apollo'
import { makeStyles } from '@material-ui/core'

import Header from '../components/ui/Header'
import Map from '../components/Map'
import Blog from '../components/Blog'

// https://github.com/awslabs/aws-mobile-appsync-sdk-js
// const GET_POST = gql`
//   {
//     singlePost(id: 1) {
//       id
//       title
//     }
//   }
// `

// const ADD_PLACE = gql`
//   mutation AddPlace($placeInput: PlaceInput) {
//     addPlace(place: $placeInput) {
//       latitude
//       longitude
//       address
//       name
//       phone
//     }
//   }
// `

const useStyles = makeStyles(theme => ({
  root: {}
}))

export default function AddPlace () {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Header />
      <Map>
        <Blog />
      </Map>

      {/* Blog Area to add Pin Content */}
      {/* <Blog /> */}

      {/* <Query query={GET_POST}>
        {({ data, loading, error }) => {
          const { singlePost } = data
          return (
            <div>
              123
              {loading && <p>Loading...</p>}
              {error && <p>Error :( Please try again</p>}
              {console.log('data=', data)}
              {singlePost && singlePost.title}
            </div>
          )
        }}
      </Query> */}
      {/*       
      <Mutation mutation={ADD_PLACE}>
        {(addPlace, { data, loading, error }) => {
          // const { addPlace } = data
          return (
            <div>
              <button
                onClick={() => {
                  console.log(addPlace)
                  addPlace({
                    variables: {
                      placeInput: {
                        latitude: 35,
                        longitude: 48,
                        address: 'Novokrymska 6, Dnipro',
                        name: 'home7',
                        phone: '097-37-66-706'
                      }
                    }
                  })
                }}
              >
                AddPlace
              </button>
              {loading && <p>Loading...</p>}
              {error && <p>Error :( Please try again</p>}
              {console.log('data=', data)}
            </div>
          )
        }}</Mutation> */}
    </div>
  )
}
