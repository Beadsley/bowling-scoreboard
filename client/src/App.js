import React from 'react';
import './styles/App.css';
import Game from './components/Game';
import { theme } from './config';
import { makeStyles, AppBar, Toolbar, Typography, MuiThemeProvider } from '@material-ui/core/';

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

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MuiThemeProvider theme={theme}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' className={classes.title}>
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
