import React from 'react'
import { Typography, makeStyles, TextField, Button } from '@material-ui/core'
import { Explore as ExploreIcon } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  icon: {
    margin: theme.spacing(),
    fontSize: '80px'
  }
}))

export default function NoContent () {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <ExploreIcon className={classes.icon} />
      <Typography
        noWrap
        component='h2'
        variant='h6'
        align='center'
        color='textPrimary'
        gutterBottom
      >
        Click on the map to add pin
      </Typography>
    </div>
  )
}
