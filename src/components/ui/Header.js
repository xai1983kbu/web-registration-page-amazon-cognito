import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Button,
  CssBaseline,
  Toolbar,
  Tabs,
  Tab,
  MenuItem,
  useMediaQuery,
  useTheme,
  Menu,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import { makeStyles } from '@material-ui/core'
import { Link, useRouteMatch, useLocation } from 'react-router-dom'

import logo from '../../assets/logo.svg'
import {
  siteRoutes as routes,
  allRoutesArray,
  allIndexArray
} from '../../routing'

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
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: '0.4em',
    [theme.breakpoints.down('md')]: {
      marginBottom: '0.6em'
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: '1.25em'
    }
  },
  logo: {
    height: '5em'
  },
  logoContainer: {
    padding: 0,
    '&:hover': {
      background: 'transparent'
    }
  },
  tabContainer: {
    marginLeft: 'auto'
  },
  tab: {
    ...theme.typography.tab,
    minWidth: 10,
    marginLeft: '25px'
  },
  menu: {
    backgroundColor: theme.palette.common.landBlue,
    color: 'white',
    borderRadius: '0px'
  },
  menuItem: {
    ...theme.typography.tab,
    opacity: 0.7,
    '&:hover': {
      opacity: 1
    }
  },
  drawerIconContainer: {
    marginLeft: 'auto',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  drawerIcon: {
    height: '50px',
    width: '50px'
  },
  drawer: {
    backgroundColor: theme.palette.common.landBlue
  },
  drawerItem: {
    ...theme.typography.tab,
    color: 'white',
    opacity: 0.7
  },
  drawerItemSelected: {
    '& .MuiListItemText-root': {
      opacity: 1
    }
  },
  appbar: {
    zIndex: theme.zIndex.modal + 1 // modal is used underneath of drawer
  }
}))

export default function Header ({ isMapPage }) {
  const classes = useStyles()
  const theme = useTheme()
  const mediaMatches = useMediaQuery(theme.breakpoints.down('md'))
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [value, setValue] = useState(0)
  const [selectedSMenuIndex, setSelectedSMenuIndex] = useState(0)

  const [anchorEl, setAnchorEl] = useState(null)
  const [openSMenu, setOpenSMenu] = useState(false)

  const handleSMenuClose = () => {
    setAnchorEl(null)
    setOpenSMenu(false)
  }

  const handleChange = (e, newValue) => {
    setValue(newValue)
  }

  const handleClick = e => {
    setAnchorEl(e.currentTarget)
    setOpenSMenu(true)
  }

  const handleSMenuItemClick = (e, i) => {
    setAnchorEl(null)
    setOpenSMenu(false)
    setSelectedSMenuIndex(i)
  }

  const match = useRouteMatch(allRoutesArray)
  const location = useLocation()
  useEffect(() => {
    if (match) {
      const indexInArray = allRoutesArray.indexOf(match.path)
      const tabIndexString = allIndexArray[indexInArray]
      const tabInt = parseInt(tabIndexString[0])
      setValue(tabInt)
    }
  }, [location.pathname, match])

  const tabs = (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        className={classes.tabContainer}
        indicatorColor='primary'
      >
        {Object.keys(routes).map((key, index) => {
          // const isnum = /^\d+$/.test(key)
          const mainRoute = routes[key]
          const ariaOwns =
            '0' in mainRoute ? mainRoute['0']['ariaOwns'] : undefined
          const ariaPopup =
            '0' in mainRoute ? mainRoute['0']['ariaPopup'] : undefined
          const mouseOver =
            '0' in mainRoute ? mainRoute['0']['mouseOver'] : undefined

          return (
            <Tab
              key={`${key}${index}`}
              className={classes.tab}
              component={Link}
              to={
                'link' in mainRoute ? mainRoute['link'] : mainRoute['0']['link']
              }
              label={
                'name' in mainRoute ? mainRoute['name'] : mainRoute['0']['name']
              }
              aria-owns={anchorEl ? ariaOwns : undefined}
              aria-haspopup={anchorEl ? ariaPopup : undefined}
              onMouseOver={mouseOver ? event => handleClick(event) : undefined}
            />
          )
        })}
      </Tabs>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        open={openSMenu}
        keepMounted
        onClose={handleSMenuClose}
        MenuListProps={{ onMouseLeave: handleSMenuClose }}
        classes={{ paper: classes.menu }}
        style={{ zIndex: 1302 }}
        elevation={0}
      >
        {Object.keys(routes['1']).map((key, index) => {
          const route = routes['1'][key]
          return (
            <MenuItem
              key={`${route}${index}`}
              onClick={event => {
                handleSMenuItemClick(event, index)
                setValue(1)
                handleSMenuClose()
              }}
              selected={index === selectedSMenuIndex && value === 1}
              component={Link}
              to={route.link}
              classes={{ root: classes.menuItem }}
            >
              {route.name}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )

  const drawer = (
    <>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onOpen={() => setOpenDrawer(true)}
        classes={{ paper: classes.drawer }}
      >
        <div className={classes.toolbarMargin} />
        <List disablePadding>
          {Object.keys(routes).map((key, index) => {
            // const isnum = /^\d+$/.test(key)
            const mainRoute = routes[key]
            return (
              <ListItem
                key={`${mainRoute}${index}`}
                divider
                button
                component={Link}
                to={'0' in mainRoute ? mainRoute['0'].link : mainRoute.link}
                selected={value === key}
                classes={{ selected: classes.drawerItemSelected }}
                onClick={() => {
                  setOpenDrawer(false)
                  setValue(index)
                }}
              >
                <ListItemText className={classes.drawerItem} disableTypography>
                  {'0' in mainRoute ? mainRoute['0'].name : mainRoute.name}
                </ListItemText>
              </ListItem>
            )
          })}
        </List>
      </SwipeableDrawer>
      <IconButton
        className={classes.drawerIconContainer}
        onClick={() => setOpenDrawer(!openDrawer)}
        disableRipple
      >
        <MenuIcon className={classes.drawerIcon} />
      </IconButton>
    </>
  )

  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll>
        <AppBar position='fixed' color='primary' className={classes.appbar}>
          <Toolbar disableGutters>
            <Button
              className={classes.logoContainer}
              component={Link}
              to='/'
              onClick={() => setValue(0)}
            >
              <img alt='company logo' className={classes.logo} src={logo} />
            </Button>
            {mediaMatches ? drawer : tabs}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div className={classes.toolbarMargin} />
    </React.Fragment>
  )

  // return (
  //   <React.Fragment>
  //     <CssBaseline />
  //     <ElevationScroll>
  //       <AppBar position='fixed' color='primary'>
  //         <Toolbar disableGutters>
  //           <Button
  //             className={classes.logoContainer}
  //             component={Link}
  //             to='/'
  //             onClick={() => setValue(0)}
  //           >
  //             <img alt='company logo' className={classes.logo} src={logo} />
  //           </Button>
  //           <div className={classes.root}>
  //             <Tabs
  //               value={value}
  //               onChange={handleChange}
  //               className={classes.tabContainer}
  //               indicatorColor='primary'
  //             >
  //               <Tab
  //                 className={classes.tab}
  //                 component={Link}
  //                 to='/'
  //                 label='Home'
  //               />
  //               <Tab
  //                 className={classes.tab}
  //                 component={Link}
  //                 to='/about'
  //                 label='About'
  //               />
  //               <Tab
  //                 className={classes.tab}
  //                 component={Link}
  //                 to='/addplace'
  //                 label='Addplace'
  //               />
  //               <Tab
  //                 className={classes.tab}
  //                 component={Link}
  //                 to='/register'
  //                 label='Register'
  //               />
  //             </Tabs>
  //           </div>
  //         </Toolbar>
  //       </AppBar>
  //     </ElevationScroll>
  //   </React.Fragment>
  // )
}
