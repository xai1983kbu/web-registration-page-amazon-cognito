import gql from 'graphql-tag'

// https://github.com/awslabs/aws-mobile-appsync-sdk-js
export const SEARCH_PLACES_IN_R5000 = gql`
  query search($pointInput: PointInput) {
    queryRadius(radius: 5000, centerPoint: $pointInput) {
      latitude
      latitude
      name
      address
      phone
    }
  }
`
