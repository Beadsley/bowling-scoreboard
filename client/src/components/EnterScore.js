import React, { useState, useEffect } from 'react';
import EnterName from './EnterName';

function EnterScore() {

  const [buttons, setButtons] = useState([]);
  const [game, setGame] = useState({ started: false, roll: 0, score: [], frame: 1, frameScore: 0, currentPlayer: undefined, });
  const [players, setPlayers] = useState([]);

  useEffect(() => {

    if (game.started) {

      if (game.frameScore === 10 && game.roll === 1) {
        setGame({ started: game.started, roll: game.roll + 1, score: [10, 0], frame: game.frame, frameScore: game.frameScore, currentPlayer: game.currentPlayer })
      }
      if (game.roll === 2) { addScore() }
      generateScoreButtons();

    }


    // eslint-disable-next-line
  }, [game.score, game.started, game.currentPlayer]);

  useEffect(() => {
    if (game.started) {
      fetchPlayers();
    }

  }, [game.started])

  async function fetchPlayers() {

    const response = await fetch('/api/players')
    const result = await response.json();
    let playersArray = []
    for (const id in result) {
      playersArray.push({
        id: id,
        name: result[id].name,
        playing: false
      })
    }
    setPlayers(playersArray) // add players to the game array
    setGame({ started: game.started, roll: game.roll, score: game.score, frame: game.frame, frameScore: game.frameScore, currentPlayer: playersArray[0].id })

  }

  async function addScore() {

    const response = await fetch(`/api/player/score/${game.currentPlayer}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "roll": game.score
      })
    })
    console.log(await response.json());
    console.log(players);
    let index = players.findIndex(player => player.id == game.currentPlayer)
    if (index === players.length - 1) {
      index = 0;
      const nextPlayer = players[index].id;
      setGame({ started: game.started, score: [], roll: 0, frameScore: 0, frame: game.frame + 1, currentPlayer: nextPlayer });
    }
    else {
      index++;
      const nextPlayer = players[index].id;
      setGame({ started: game.started, score: [], roll: 0, frameScore: 0, frame: game.frame, currentPlayer: nextPlayer });
    }

  }


  function generateScoreButtons() {

    let array = [];
    for (let index = 1; index <= 10 - game.frameScore; index++) {

      array.push(<button onClick={() => { setGame({ started: game.started, roll: game.roll + 1, score: [...game.score, index], frame: game.frame, frameScore: index, currentPlayer: game.currentPlayer }) }}>{index}</button>)
    }
    setButtons(array);
  }

  function startGame() {

    setGame({
      started: true,
      roll: game.roll,
      score: game.score,
      frame: game.frame,
      frameScore: game.frameScore,
      currentPlayer: game.currentPlayer
    })

  }

  return (
    <>
      {buttons}
      {/* <button onClick={() => startGame()}>StartGame</button> */}
      <EnterName {...game} onClick={startGame} />
    </>
  );
}

export default EnterScore;
