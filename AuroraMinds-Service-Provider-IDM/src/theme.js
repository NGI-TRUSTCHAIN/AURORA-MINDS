import { createMuiTheme } from '@material-ui/core/styles';
import Image from './static/restaurant.jpg'; 

export const theme = createMuiTheme({
  palette: {
    background: {
      backgroundImage: `url(${Image})`,
      paper: '#fff',
    },
    primary: {
      main: '#403f44'
    },
    secondary: {
      main: '#56978e'
    },
    warmGrey: {
      main: '#403f44',
      light: '#f5f5f5'
    },
    success: {
      main: '#5CBC84'
    },
    warning: {
      main: '#EDD75E'
    },
    error: {
      main: '#F04B2E'
    },
    unknown: {
      main: '#80808055'
    },
    common: {
      black: '#000',
      white: '#fff'
    },
  }
});
