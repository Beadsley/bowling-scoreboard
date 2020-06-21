import React, { useState, useEffect } from 'react';
import InputPlayer from './InputPlayer';
import Scoreboard from './Scoreboard';
import { deletePlayer } from '../services/network/api';

function Players(game) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (game.started) {
      selectPlayer();
    }
  }, [game.started]);

  useEffect(() => {
    if (game.scoreAdded === true) {
      selectNextPlayer();
    }
  }, [game.scoreAdded]);

  useEffect(() => {
    if (game.frame >= 10 && game.roll === 2) {
      evalFrame();
    }
  }, [game.score]);

  useEffect(() => {
    if (game.started) {
      handleDeletePlayers();
    }
  }, [game.restart]);

  window.onbeforeunload = () => {
    handleDeletePlayers();
  };

  function addPlayer(id, name) {
    const player = {
      id,
      name,
      gameOver: false,
      frame10: 'nothing',
    };
    setPlayers([...players, player]);
  }

  function selectPlayer() {
    game.update({ ...game, currentPlayer: { id: players[0].id, name: players[0].name, frame10: 'nothing' } });
  }

  function selectNextPlayer() {
    let index = players.findIndex((player) => player.id == game.currentPlayer.id);
    index === players.length - 1 ? (index = 0) : index++;

    if (players[index].gameOver) {
      index = players.findIndex((player) => player.gameOver === false);
    }

    if (index !== -1) {
      const nextPlayer = { id: players[index].id, name: players[index].name, frame10: players[index].frame10 };
      game.update({
        ...game,
        score: [],
        roll: 0,
        frameScore: 0,
        frame: index === 0 ? game.frame + 1 : game.frame,
        currentPlayer: nextPlayer,
        scoreAdded: false,
      });
    } else {
      game.update({
        ...game,
        score: [],
        roll: 0,
        frameScore: 0,
        frame: index === 0 ? game.frame + 1 : game.frame,
        scoreAdded: false,
        finished: true,
      });
    }
  }

  function handleDeletePlayers() {
    players.forEach((player) => {
      deletePlayer(player.id);
    });
    game.update({
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

  function evalFrame() {
    const currentPlayerIndex = players.findIndex((player) => player.id == game.currentPlayer.id);
    if (game.frame === 11) {
      players[currentPlayerIndex].gameOver = true;
    } else if (game.score[0] === 10) {
      players[currentPlayerIndex].frame10 = 'strike';
    } else if (game.score[0] + game.score[1] === 10) {
      players[currentPlayerIndex].frame10 = 'spare';
    } else {
      players[currentPlayerIndex].gameOver = true;
    }
    setPlayers([...players]);
  }

  return (
    <div>
      <InputPlayer {...game} addPlayer={addPlayer} players={players} />
      <Scoreboard {...game} players={players} />
    </div>
  );
}

export default Players;
