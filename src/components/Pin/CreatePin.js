import React, { useState, useContext } from 'react'
import { Typography, makeStyles, TextField, Button } from '@material-ui/core'
import LandscapeIcon from '@material-ui/icons/Landscape'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import ClearIcon from '@material-ui/icons/Clear'
import SaveIcon from '@material-ui/icons/Save'

import Context from '../../context'

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingButtom: theme.spacing()
  },
  contentField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: '95%'
  },
  input: {
    display: 'none'
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center'
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing()
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing()
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing()
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing()
  }
}))

export default function CreatePin () {
  const { dispatch } = useContext(Context)
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [content, setContent] = useState('')

  const handleDeleteDraft = event => {
    setTitle('')
    setImage('')
    setContent('')
    dispatch({ type: 'DELETE_DRAFT' })
  }

  const handleSubmit = event => {
    event.preventDefault()
    console.log({ title, image, content })
  }

  const classes = useStyles()
  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component='h2'
        variant='h4'
        color='secondary'
      >
        <LandscapeIcon className={classes.iconLarge} /> Pin Location
      </Typography>
      <div>
        <TextField
          name='title'
          label='Title'
          placeholder='Insert pin title'
          onChange={e => setTitle(e.target.value)}
        />

        <input
          accept='image/*' // image of any type
          id='image'
          type='file'
          className={classes.input}
          onChange={e => setImage(e.target.files[0])}
        />
        <label htmlFor='image'>
          <Button
            style={{ color: image && 'green' }}
            component='span'
            size='small'
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name='content'
          label='Content'
          multiline
          rows='6'
          variant='outlined'
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div>
        <Button
          onClick={handleDeleteDraft}
          className={classes.button}
          variant='contained'
          color='primary'
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          type='submit'
          className={classes.button}
          variant='contained'
          color='secondary'
          disabled={!title.trim() || !image || !content.trim()}
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  )
}
