import React, { useState, useEffect } from 'react';
import InputPlayer from './InputPlayer';
import Scoreboard from './Scoreboard';
import { deletePlayer } from '../services/network/api';

function Players(props) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    props.started && handleSelectPlayer();
  }, [props.started]);

  useEffect(() => {
    props.scoreAdded && handleSelectNextPlayer();
  }, [props.scoreAdded]);

  useEffect(() => {
    props.frame >= 10 && props.roll === 2 && handleEvalFrame();
  }, [props.score]);

  useEffect(() => {
    props.started && handleDeletePlayers();
  }, [props.restart]);

  window.onbeforeunload = () => {
    handleDeletePlayers();
  };

  function handleAddPlayer(id, name) {
    const player = {
      id,
      name,
      gameOver: false,
      frame10: 'nothing',
    };
    setPlayers([...players, player]);
  }

  function handleSelectPlayer() {
    props.update({ ...props, currentPlayer: { id: players[0].id, name: players[0].name, frame10: 'nothing' } });
  }

  function handleSelectNextPlayer() {
    let index = players.findIndex((player) => player.id == props.currentPlayer.id);
    index === players.length - 1 ? (index = 0) : index++;

    if (players[index].gameOver) {
      index = players.findIndex((player) => player.gameOver === false);
    }

    if (index !== -1) {
      const nextPlayer = { id: players[index].id, name: players[index].name, frame10: players[index].frame10 };
      props.update({
        ...props,
        score: [],
        roll: 0,
        frameScore: 0,
        frame: index === 0 ? props.frame + 1 : props.frame,
        currentPlayer: nextPlayer,
        scoreAdded: false,
      });
    } else {
      props.update({
        ...props,
        score: [],
        roll: 0,
        frameScore: 0,
        frame: index === 0 ? props.frame + 1 : props.frame,
        scoreAdded: false,
        finished: true,
      });
    }
  }

  function handleDeletePlayers() {
    players.forEach((player) => {
      deletePlayer(player.id);
    });
    props.update({
      started: false,
      roll: 0,
      score: [],
      frame: 1,
      frameScore: 0,
      currentPlayer: { id: undefined, name: undefined, frame10: 'nothing' },
      restarted: false,
      finished: false,
      scoreAdded: false,
    });
    setPlayers([]);
  }

  function handleEvalFrame() {
    const currentPlayerIndex = players.findIndex((player) => player.id == props.currentPlayer.id);
    if (props.frame === 11) {
      players[currentPlayerIndex].gameOver = true;
    } else if (props.score[0] === 10) {
      players[currentPlayerIndex].frame10 = 'strike';
    } else if (props.score[0] + props.score[1] === 10) {
      players[currentPlayerIndex].frame10 = 'spare';
    } else {
      players[currentPlayerIndex].gameOver = true;
    }
    setPlayers([...players]);
  }

  return (
    <div>
      <InputPlayer {...props} addPlayer={handleAddPlayer} players={players} />
      <Scoreboard {...props} players={players} />
    </div>
  );
}

export default Players;
