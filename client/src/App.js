import React from 'react';
import './styles/App.css';
import Game from './components/Game';
import { makeStyles, AppBar, Toolbar, Typography, MuiThemeProvider, createMuiTheme } from '@material-ui/core/';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minWidth: 1200,
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(4),
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#fff',
      main: 'rgb(23, 105, 170)',
      dark: '#000'
    },
    secondary: {
      main: '#58a5f0',
    },
  },
  typography: {
    fontFamily: [
      'Baloo 2',
      'cursive',
    ].join(','),
  }
});


function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MuiThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Bowling Scoreboard
        </Typography>
          </Toolbar>
        </AppBar>
        <Game />
      </MuiThemeProvider>
    </div>
  );
}

export default App;
