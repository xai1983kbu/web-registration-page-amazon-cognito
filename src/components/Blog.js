import React, { useContext } from 'react'
import NoContent from '../components/Pin/NoContent'
// import PinContent from '../components/Pin/PinContent'
import CreatePin from '../components/Pin/CreatePin'
import { Paper, makeStyles } from '@material-ui/core'

import Context from '../context'

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 350,
    maxWidth: 400,
    overflowY: 'scroll',
    display: 'flex',
    justifyContent: 'center'
  }
}))

export default function Blog () {
  const classes = useStyles()
  const { state } = useContext(Context)
  const { draft } = state

  let BlogContent
  if (!draft) {
    // no content
    BlogContent = NoContent
  } else if (draft) {
    // create pin
    BlogContent = CreatePin
  }

  return (
    <Paper className={classes.root}>
      <BlogContent />
    </Paper>
  )
}
