import React, { useState, useEffect, useContext } from 'react'
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl'

import { Button, Typography, makeStyles } from '@material-ui/core'
import { DeleteIcon } from '@material-ui/icons'
import PinIcon from '../components/PinIcon'
import Blog from '../components/Blog'
import Context from '../context'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em'
  }
}))

const INITIAL_VIEWPORT = {
  latitude: 48.45,
  longitude: 34.9833,
  zoom: 13
}

export default function Map () {
  const classes = useStyles()
  const { state, dispatch } = useContext(Context)
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
  const [userPosition, setUserPosition] = useState(null)

  useEffect(() => {
    getUserPosition()
  }, [])

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
      >
        {/* Navigation Control */}
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
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
      </ReactMapGL>

      {/* Blog Area to add Pin Content */}
      <Blog />
    </div>
  )
}
