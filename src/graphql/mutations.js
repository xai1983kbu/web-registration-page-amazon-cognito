import gql from 'graphql-tag'

// https://github.com/awslabs/aws-mobile-appsync-sdk-js
export const ADD_PLACE = gql`
  mutation AddPlace($placeInput: PlaceInput) {
    addPlace(place: $placeInput) {
      latitude
      longitude
      title
      content
      image {
        bucket
        region
        key
      }
      userId
    }
  }
`
