import React, { useState, useEffect } from 'react';
import Pins from './Pins';
import Players from './Players';
import { makeStyles, Button } from '@material-ui/core/';
import Icon from '@material-ui/core/Icon';
import { appendScore } from '../services/network/api';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    textAlign: 'center',
  },
}));

function Game() {
  const [game, setGame] = useState({
    started: false,
    roll: 0,
    score: [],
    frame: 1,
    frameScore: 0,
    currentPlayer: { id: undefined, name: undefined, frame10: 'nothing' },
    restart: false,
    finished: false,
    scoreAdded: false,
  });
  const classes = useStyles();

  useEffect(() => {
    if (game.started) {
      if (game.frameScore === 10 && game.roll === 1 && game.frame < 11) {
        setGame({ ...game, roll: game.roll + 1, score: [10, 0] });
      } else if (game.frame === 11 && game.currentPlayer.frame10 === 'spare' && game.roll === 1) {
        setGame({ ...game, roll: game.roll + 1, score: [game.frameScore, 0] });
      } else if (game.roll === 2) {
        handleAddScore();
      }
    }
  }, [game.score, game.started, game.currentPlayer, game.finished]);

  function handleStartGame() {
    setGame({ ...game, started: true });
  }

  async function handleAddScore() {
    const response = await appendScore(game.currentPlayer.id, game.score);
    response.status === 200 && setGame({ ...game, scoreAdded: true });
  }

  function handleUpdateAfterRoll(pin) {
    setGame({
      ...game,
      roll: game.roll + 1,
      score: [...game.score, pin],
      frameScore: game.frame === 11 && pin === 10 ? 0 : pin,
    });
  }

  function handleUpdateGame(updatedValue) {
    setGame(updatedValue);
  }

  function handleRestart() {
    setGame({ ...game, restart: true });
  }

  return (
    <div className={classes.root}>
      {game.finished || !game.started ? '' : <Pins {...game} update={handleUpdateAfterRoll}></Pins>}
      <Players {...game} startGame={handleStartGame} update={handleUpdateGame}></Players>
      <Button
        style={game.started ? { visibility: 'visible' } : { visibility: 'hidden' }}
        variant='contained'
        color='primary'
        className={classes.button}
        endIcon={<Icon>autorenew</Icon>}
        onClick={handleRestart}
      >
        Restart
      </Button>
    </div>
  );
}

export default Game;
