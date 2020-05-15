import React, { useState, useEffect, useContext } from 'react'
import ReactMapGL, {
  NavigationControl,
  Marker,
  ScaleControl
} from 'react-map-gl'
import { SEARCH_PLACES_IN_R5000 } from '../graphql/query'
// import { useQuery } from 'react-apollo-hooks'
import { useLazyQuery, useApolloClient } from '@apollo/react-hooks'

import {
  // Button,
  // Typography,
  makeStyles,
  Button
} from '@material-ui/core'
// import { DeleteIcon } from '@material-ui/icons'
import PinIcon from '../components/PinIcon'
import Context from '../context'
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em'
  },
  scaleControl: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: '1em'
  }
}))

const INITIAL_VIEWPORT = {
  latitude: 48.45,
  longitude: 34.9833,
  zoom: 13
}

export default function Map ({ children }) {
  const classes = useStyles()
  const { state, dispatch } = useContext(Context)
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
  const [userPosition, setUserPosition] = useState(null)
  let location = useLocation()
  // const [searchPlacesInR5000, { called, loading, data }] = useLazyQuery(
  // SEARCH_PLACES_IN_R5000
  // {
  //   variables: {
  //     pointInput: {
  //       latitude: viewport.latitude,
  //       longitude: viewport.longitude
  //     }
  //   }
  // }
  // )
  const client = useApolloClient()

  useEffect(() => {
    if (userPosition !== null) getPins()
  }, [userPosition])

  // useEffect(() => {
  //   console.log(called, loading, data)
  // }, [loading])

  useEffect(() => {
    getUserPosition()
  }, [])

  useEffect(() => {
    dispatch({
      type: 'DELETE_DRAFT'
    })
  }, [location])

  const getPins = async () => {
    const { data } = await client.query({
      query: SEARCH_PLACES_IN_R5000,
      variables: {
        pointInput: {
          latitude: viewport.latitude,
          longitude: viewport.longitude
        }
      }
    })
    if ('queryRadius' in data)
      dispatch({ type: 'GET_PINS', payload: data['queryRadius'] })
  }

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        setViewport({ ...viewport, latitude, longitude })
        setUserPosition({ latitude, longitude })
      })
    }
  }

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return
    if (!state.draft) {
      dispatch('CREATE_DRAFT')
    }
    const [longitude, latitude] = lngLat
    dispatch({
      type: 'UPDATE_DRAFT_LOCATION',
      payload: {
        longitude,
        latitude
      }
    })
  }
  return (
    <div className={classes.root}>
      <ReactMapGL
        width='100vw'
        height='100vh'
        mapStyle='mapbox://styles/mapbox/outdoors-v11' //https://docs.mapbox.com/mapbox-gl-js/api/
        mapboxApiAccessToken={`${process.env.REACT_APP_MapBox}`}
        onViewportChange={newViewport => setViewport(newViewport)}
        {...viewport}
        onClick={handleMapClick}
        dragPan
      >
        {/* Navigation Control */}
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>
        <div className={classes.scaleControl}>
          <ScaleControl />
        </div>

        {/* Pin for User's Current Position */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19} // -19px
            offsetTop={-37} // -37px
          >
            <PinIcon size={40} color='red' />
          </Marker>
        )}

        {/* Draft Pin */}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19} // -19px
            offsetTop={-37} // -37px
          >
            <PinIcon size={40} color='hotpink' />
          </Marker>
        )}

        {/* Created Pins */}
        {state.pins.map(pin => (
          <Marker
            key={`${pin.latitude}${pin.longitude}`}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19} // -19px
            offsetTop={-37} // -37px
          >
            <PinIcon size={40} color='darkblue' />
          </Marker>
        ))}
      </ReactMapGL>

      {/* Blog Area to add Pin Content */}
      {children}
    </div>
  )
}
