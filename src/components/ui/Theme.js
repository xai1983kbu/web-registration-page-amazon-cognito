import { createMuiTheme } from '@material-ui/core/styles'
import purple from '@material-ui/core/colors/purple'
import green from '@material-ui/core/colors/green'

const landBlue = '#0B72B9'
const landOrange = '#FFBA60'

export default createMuiTheme({
  palette: {
    common: {
      landBlue: `${landBlue}`,
      landOrange: `${landOrange}`
    },
    primary: {
      main: `${landBlue}`
    },
    secondary: {
      main: `${landOrange}`
    }
  },
  typography: {
    tab: {
      fontFamily: 'Relway',
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '1rem'
    }
  }
})
