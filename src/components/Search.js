import React from 'react'
import NoContent from '../components/Area/NoContent'
import { Paper, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 350,
    maxWidth: 400,
    overflowY: 'scroll',
    display: 'flex',
    justifyContent: 'center'
  }
}))

export default function Search () {
  const classes = useStyles()
  return (
    <Paper className={classes.root}>
      <NoContent />
    </Paper>
  )
}
