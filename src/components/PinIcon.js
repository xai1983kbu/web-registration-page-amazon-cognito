import React from 'react'
import { PlaceTwoTone } from '@material-ui/icons'

export default ({ size, color, onClick }) => (
  <PlaceTwoTone onClick={onClick} style={{ fontSize: size, color }} />
)
