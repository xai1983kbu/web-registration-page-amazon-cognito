import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Button,
  CssBaseline,
  Toolbar,
  Tabs,
  Tab,
  Paper
} from '@material-ui/core'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import { makeStyles } from '@material-ui/core'
import { Link, useRouteMatch, useLocation } from 'react-router-dom'

import logo from '../../assets/logo.svg'
import { allRoutesArray, allIndexArray } from '../../routing'

function ElevationScroll (props) {
  const { children, window } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  })

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  })
}

const useStyles = makeStyles(theme => ({
  // root: {
  //   flexGrow: 1
  // },
  logo: {
    height: '5em'
  },
  logoContainer: {
    padding: 0,
    '&:hover': {
      background: 'transparent'
    }
  },
  // tabContainer: {
  //   marginLeft: 'auto'
  // },
  tab: {
    ...theme.typography.tab,
    minWidth: 0,
    marginLeft: '25px'
  }
}))

export default function Header () {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  // const tabLinks = ['/about', '/addplace', '/register', '/']
  // const aboutLinks = ['/about/1', '/about2']
  // const match = useRouteMatch(tabLinks)

  const handleChange = (e, value) => {
    setValue(value)
  }

  const match = useRouteMatch(allRoutesArray)
  const location = useLocation()
  // console.log(allRoutesArray, match, location)
  useEffect(() => {
    if (match) {
      const indexInArray = allRoutesArray.indexOf(match.path)
      const tabIndexString = allIndexArray[indexInArray]
      const tabInt = parseInt(tabIndexString[0])
      setValue(tabInt)
    }
  }, location.path)

  // useEffect(() => {
  //   if (window.location.pathname === '/' && value !== 0) {
  //     setValue(0)
  //   } else if (window.location.pathname === '/about' && value !== 1) {
  //     setValue(1)
  //   } else if (window.location.pathname === '/addplace' && value !== 2) {
  //     setValue(2)
  //   } else if (window.location.pathname === '/register' && value !== 3) {
  //     setValue(3)
  //   }
  // }, [value])

  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll>
        <AppBar position='fixed' color='primary'>
          <Toolbar disableGutters>
            <Button
              className={classes.logoContainer}
              component={Link}
              to='/'
              onClick={() => setValue(0)}
            >
              <img alt='company logo' className={classes.logo} src={logo} />
            </Button>
            <div className={classes.root}>
              <Tabs
                value={value}
                onChange={handleChange}
                className={classes.tabContainer}
                indicatorColor='primary'
              >
                <Tab
                  className={classes.tab}
                  component={Link}
                  to='/'
                  label='Home'
                />
                <Tab
                  className={classes.tab}
                  component={Link}
                  to='/about'
                  label='About'
                />
                <Tab
                  className={classes.tab}
                  component={Link}
                  to='/addplace'
                  label='Addplace'
                />
                <Tab
                  className={classes.tab}
                  component={Link}
                  to='/register'
                  label='Register'
                />
              </Tabs>
            </div>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </React.Fragment>
  )
}
