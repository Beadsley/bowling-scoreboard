import React, { useState } from 'react';
import { createPlayer } from '../services/network/api';
import { makeStyles, Input, InputLabel, InputAdornment, FormControl, Icon, Button } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Alert from './Alert';
import Form from 'react-bootstrap/Form';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

function InputPlayer(game) {
  const [userInput, setUserInput] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const classes = useStyles();

  function handleUserInput(e) {
    setUserInput(e.target.value);
  }

  async function handleCreatePlayer(name) {
    const response = await createPlayer(name);
    const { _id } = await response.data;
    game.addPlayer(_id, name);
    openAlert && setOpenAlert(false);
  }

  function handleAlert() {
    setOpenAlert(true);
  }

  function handleCloseAlert() {
    setOpenAlert(false);
  }

  return (
    <>
      <Alert message='Add a player...' open={openAlert} closeAlert={handleCloseAlert} />
      <div
        className={classes.inputContainer}
        style={game.started ? { visibility: 'hidden' } : { visibility: 'visible' }}
      >
        <Form
          className={classes.formContainer}
          onChange={handleUserInput}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCreatePlayer(userInput);
            setUserInput('');
          }}
        >
          <FormControl className={classes.margin} onChange={handleUserInput} required>
            <InputLabel htmlFor='input-with-icon-adornment'>Add a player...</InputLabel>
            <Input
              value={userInput}
              autoComplete='off'
              id='input-with-icon-adornment'
              type='text'
              inputProps={{
                maxLength: 10,
              }}
              startAdornment={
                <InputAdornment position='start'>
                  <AccountCircle />
                </InputAdornment>
              }
            />
          </FormControl>
          <Button type='submit' variant='outlined' color='primary'>
            Submit
          </Button>
        </Form>
        <Button
          variant='contained'
          color='primary'
          className={classes.button}
          endIcon={<Icon>send</Icon>}
          onClick={game.players.length !== 0 ? game.startGame : () => handleAlert()}
        >
          Start
        </Button>
      </div>
    </>
  );
}

export default InputPlayer;
