import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

// https://github.com/awslabs/aws-mobile-appsync-sdk-js
const GET_POST = gql`
  {
    singlePost(id: 1) {
      id
      title
    }
  }
`

export default function AddPlace () {
  return (
    <Query query={GET_POST}>
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
    </Query>
  )
}
