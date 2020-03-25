import React, { useState, useEffect } from 'react';
import Scoreboard from './Scoreboard';
import Input from './Input';

function Score() {

  const [buttons, setButtons] = useState([]);
  const [game, setGame] = useState({ started: false, roll: 0, score: [], frame: 1, frameScore: 0, currentPlayer: { id: undefined, name: undefined } });
  const [players, setPlayers] = useState([]);

  useEffect(() => {


    if (game.started) {

      //console.log('frame', game.frame, 'prevframesscore: ', game.frameScore, 'roll: ', game.roll, game.currentPlayer);

      if (game.frameScore === 10 && game.roll === 1 && game.frame < 11) {
        // strike
        setGame({ ...game, roll: game.roll + 1, score: [10, 0] })
      }
      else if (game.frame === 11) {
        const index = players.findIndex(player => player.id == game.currentPlayer.id);
        if (game.roll === 1 && players[index].frame10Strike === false) {
          // spare 
          setGame({ ...game, roll: game.roll + 1, score: [game.frameScore, 0] })
        }
        else if (players[index].frame10Strike === true) {
          //strike
          console.log('strike baby');

        }
      }

      if (game.roll === 2) {
        addScore()
      }
      generateScoreButtons();

    }

    // eslint-disable-next-line
  }, [game.score, game.started, game.currentPlayer]);

  useEffect(() => {

    if (game.started) {
      selectPlayer()
    }

  }, [game.started])

  //selects the first player, perhaps add to start game
  function selectPlayer() {
    setGame({ ...game, currentPlayer: { id: players[0].id, name: players[0].name } })

  }

  function addPlayer(id, name) {
    const player = {
      id,
      name,
      gameOver: false,
      frame10Strike: false,
      frame10Spare: false
    }
    setPlayers([...players, player])
  }


  async function addScore() {

    const response = await fetch(`/api/player/score/${game.currentPlayer.id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "roll": game.score
      })
    })
    const result = await response.json()
    if (result.body.gameOver) {
      const currentPlayerIndex = players.findIndex(player => player.id == game.currentPlayer.id);
      players[currentPlayerIndex].gameOver = true;
      setPlayers([...players]);
    }

    selectNextPlayer();

  }

  function selectNextPlayer() {
    let index = players.findIndex(player => player.id == game.currentPlayer.id)

    if (index === players.length - 1) {
      index = 0;

      if (players[index].gameOver) {
        index = players.findIndex(player => player.gameOver === false);

      }
      if (index !== -1) {
        const nextPlayer = { id: players[index].id, name: players[index].name };
        setGame({ ...game, score: [], roll: 0, frameScore: 0, frame: game.frame + 1, currentPlayer: nextPlayer });
      }

    }
    else {
      index++;
      if (players[index].gameOver) {
        index = players.findIndex(player => player.gameOver === false);

      }
      if (index !== -1) {
        const nextPlayer = { id: players[index].id, name: players[index].name };
        setGame({ ...game, score: [], roll: 0, frameScore: 0, frame: game.frame, currentPlayer: nextPlayer });
      }

    }
  }

  function evalLastFrame(pin) {
    const currentPlayerIndex = players.findIndex(player => player.id == game.currentPlayer.id);
    let stikeinFinalFrame = false;
    if (game.frame === 10 && pin === 10) { // strike on frame 10
      players[currentPlayerIndex].frame10Strike = true;
    }
    else if (game.frame === 10 && game.score[0] + pin === 10) { // spare on frame 10
      players[currentPlayerIndex].frame10Spare = true;
    }
    else if (game.frame === 10 && game.roll === 1) { //game over
      players[currentPlayerIndex].gameOver = true;
    }
    else if (game.frame === 11 && players[currentPlayerIndex].frame10Strike === true && pin === 10) {
      stikeinFinalFrame = true;
    }
    setPlayers([...players]);
    return stikeinFinalFrame;

  }


  function generateScoreButtons() {

    let pins = [];
    for (let pin = 0; pin <= 10 - game.frameScore; pin++) {

      pins.push(<button onClick={() => {
        const stikeinFinalFrame = evalLastFrame(pin)
        setGame({
          ...game,
          roll: game.roll + 1,
          score: [...game.score, pin],
          frameScore: stikeinFinalFrame ? 0 : pin,
        })
      }
      }> {pin}</button >)
    }
    setButtons(pins);
  }

  function startGame() {

    setGame({ ...game, started: true, })

  }


  function gameOver() {

    const finished = players.every(player => player.gameOver === true);
    return finished

  }

  return (
    <div className="container">
      {gameOver() ? "" : buttons}
      <Input {...game} startGame={startGame} addPlayer={addPlayer} players={players} />
      <Scoreboard {...game} players={players} over={gameOver} />
      <button style={game.started ? { visibility: "visible" } : { visibility: "hidden" }}>Restart</button>
    </div>
  );
}

export default Score;
