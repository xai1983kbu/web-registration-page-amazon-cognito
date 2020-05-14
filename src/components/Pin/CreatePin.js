import React, { useState, useContext } from 'react'
import {
  Typography,
  makeStyles,
  TextField,
  Button,
  CircularProgress
} from '@material-ui/core'
import LandscapeIcon from '@material-ui/icons/Landscape'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import ClearIcon from '@material-ui/icons/Clear'
import SaveIcon from '@material-ui/icons/Save'
import S3 from 'aws-sdk/clients/s3'

import Context from '../../context'
import { ADD_PLACE } from '../../graphql/mutations'
// import { useMutation } from 'react-apollo-hooks'
import { useMutation } from '@apollo/react-hooks'

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
  const { state, dispatch } = useContext(Context)
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [content, setContent] = useState('')
  const [imgSrcBase64, setImgSrcBase64] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [addPlace, { loading }] = useMutation(ADD_PLACE)

  const handleDeleteDraft = event => {
    setTitle('')
    setImage('')
    setContent('')
    dispatch({ type: 'DELETE_DRAFT' })
  }

  const getImageFromBucket = async () => {
    const s3 = new S3({
      apiVersion: '2006-03-01',
      params: { Bucket: process.env.REACT_APP_Bucket_name },
      region: process.env.REACT_APP_Bucket_region,
      credentials: state.identity_creds
    })

    const request = s3.getObject({
      Key: image.name
    })
    return new Promise((resolve, reject) => {
      request
        .on('error', function (err) {
          reject(err)
          return
        })
        .on('success', function (response) {
          resolve(response)
        })
        .send()
    })
  }

  const handleImageUpload = async () => {
    const s3 = new S3({
      apiVersion: '2006-03-01',
      params: { Bucket: process.env.REACT_APP_Bucket_name },
      region: process.env.REACT_APP_Bucket_region,
      credentials: state.identity_creds
    })
    // console.log(image)
    return new Promise((resolve, reject) =>
      s3.upload(
        {
          Key: image.name,
          ContentType: image.type,
          Body: image,
          StorageClass: 'STANDARD',
          ACL: 'private'
        },
        async function (err, data) {
          if (err) {
            console.log('There was an error uploading your photo: ', err)
            reject(err)
            return false
          }
          // console.log('Successfully uploaded photo.')
          const imgInBucket = await getImageFromBucket()
          // console.log(data)
          resolve([data, imgInBucket.data.Body.toString('base64')])
        }
      )
    )
    // console.log('upload finished')
    // await new Promise(resolve => setTimeout(resolve, 5000))
  }

  const handleSubmit = async event => {
    try {
      event.preventDefault()
      setSubmitting(true)
      // upload image
      const [dataFromS3, uploadedImage] = await handleImageUpload()
      // console.log(dataFromS3)
      setImgSrcBase64(uploadedImage)

      // Mutation addPlace
      addPlace({
        variables: {
          placeInput: {
            latitude: 48.57307,
            longitude: 32.31873,
            address: 'Bucket' in dataFromS3 ? dataFromS3['Bucket'] : '',
            name: title,
            phone: '097-37-66-706'
          }
        }
      })

      setSubmitting(false)
    } catch (err) {
      setSubmitting(false)
    }
  }

  const classes = useStyles()

  return (
    <form className={classes.form}>
      {!submitting && imgSrcBase64 && (
        <img
          alt={'figure for Pin'}
          src={`data:img/png;base64,${imgSrcBase64}`}
          style={{ maxWidth: 300, maxHeight: 300 }}
        />
      )}
      {(submitting || loading) && <CircularProgress />}
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
          onChange={e => {
            e.target.files[0].size < 5100100
              ? setImage(e.target.files[0])
              : setImage('')
          }}
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
          disabled={
            !title.trim() || !image || !content.trim() || submitting || loading
          }
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  )
}
