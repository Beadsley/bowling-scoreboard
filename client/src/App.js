import React from 'react';
import './styles/App.css';
import Game from './components/Game';
import { makeStyles, AppBar, Toolbar, Typography, IconButton, MuiThemeProvider, createMuiTheme } from '@material-ui/core/';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
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
     useNextVariants: true
  }
});


function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MuiThemeProvider theme = { theme }>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
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
