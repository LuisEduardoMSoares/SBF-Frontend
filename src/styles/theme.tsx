import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
// Translate
import { ptBR } from '@material-ui/core/locale';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#DFE5FF',
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#FDFDFD',
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  }
}, ptBR);

theme.typography.button = {
  ...theme.typography.button,
  fontFamily: [
    '"Roboto"',
    '"Inter"',
    'Arial',
    'sans-serif'
  ].join(','),
  fontSize: 14,
  fontWeight: 400
}

export default theme;
