import React from 'react'
// import gql from 'graphql-tag'
// import { Query, Mutation } from 'react-apollo'
import Header from '../components/ui/Header'
import Map from '../components/Map'
import Search from '../components/Search'

export default function SearchPlace () {
  return (
    <div>
      <Header />
      <Map>
        <Search />
      </Map>
    </div>
  )
}
