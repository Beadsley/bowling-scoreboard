import React, { useState, useEffect } from 'react';
import EnterName from './EnterName';

function EnterScore() {

  const [roll, setRoll] = useState(0);
  const [frameScore, setFrameScore] = useState(0);
  const [buttons, setButtons] = useState([]);
  const [game, setGame] = useState({ started: false, score: [] });
  const [players, setPlayers] = useState([]);



  useEffect(() => {

    if (game.started) {

      fetchPlayers(); 
      console.log('roll: ',roll, 'score: ', game.score);
      if (roll === 2 || frameScore === 10) { addScore() }
      generateScoreButtons();

    }


    // eslint-disable-next-line
  }, [game]);

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
  }

  async function addScore() {
    console.log(game.score);
    console.log('here');
    console.log(roll);
    
    const response = await fetch(`/api/player/score/${players[0].id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "roll": game.score
      })
    })
    console.log(await response.json());
    setRoll(0); 
    setFrameScore(0);
    setGame({ started: game.started, score: [] }); 
  }


  function generateScoreButtons() {

    let array = [];
    for (let index = 1; index <= 10 - frameScore; index++) {
      array.push(<button onClick={() => { setGame({ started: game.started, score: [...game.score, index] }); setFrameScore(index); setRoll(r => r + 1) }}>{index}</button>)
    }
    setButtons(array);
  }




  return (
    <>
      {buttons}
      <button onClick={() => setGame({ started: true, score: game.score })}>StartGame</button>
      <EnterName {...game} />
    </>
  );
}

export default EnterScore;
