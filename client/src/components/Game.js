import React, { useState, useEffect } from 'react';
import axios from "axios";
import Pins from './Pins';
import Players from './Players';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles((theme) => ({
  root: {
      '& > *': {
          margin: theme.spacing(1),
      },
  },
}));

function Game() {

  const [game, setGame] = useState({ started: false, roll: 0, score: [], frame: 1, frameScore: 0, currentPlayer: { id: undefined, name: undefined, frame10: "nothing" }, restart: false, finished: false, scoreAdded: false });
  const classes = useStyles();

  useEffect(() => {

    if (game.started) {

      if (game.frameScore === 10 && game.roll === 1 && game.frame < 11) {
        setGame({ ...game, roll: game.roll + 1, score: [10, 0] });
      }
      else if (game.frame === 11 && game.currentPlayer.frame10 === 'spare' && game.roll === 1) {
        setGame({ ...game, roll: game.roll + 1, score: [game.frameScore, 0] });
      }
      else if (game.roll === 2) {
        addScore();
      }
    }

  }, [game.score, game.started, game.currentPlayer, game.finished]);

  function startGame() {
    setGame({ ...game, started: true, });
  }

  async function addScore() {

    const response = await axios.put(`/api/player/score/${game.currentPlayer.id}`, { "roll": game.score });

    if (response.status === 200) {
      setGame({ ...game, scoreAdded: true });
    }

  }

  function updateAfterRoll(pin) {

    setGame({
      ...game,
      roll: game.roll + 1,
      score: [...game.score, pin],
      frameScore: game.frame === 11 && pin === 10 ? 0 : pin,
    })
  }

  function updateGame(updatedValue) {

    setGame(updatedValue)

  }

  return (
    <div className="container">
      {game.finished || !game.started ? "" : <Pins {...game} update={updateAfterRoll}></Pins>}
      <Players {...game} startGame={startGame} update={updateGame} ></Players>
      <Button
        style={game.started ? { visibility: "visible" } : { visibility: "hidden" }}
        variant="contained"
        color="primary"
        className={classes.button}
        endIcon={<Icon>autorenew</Icon>}
        onClick={() => setGame({ ...game, restart: true })}>
        Restart
      </Button>

      {/* <button style={game.started ? { visibility: "visible" } : { visibility: "hidden" }} onClick={() => setGame({ ...game, restart: true })}>Restart</button> */}
    </div>
  );
}

export default Game;
