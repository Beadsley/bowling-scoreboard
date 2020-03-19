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

      fetchPlayers()
      setRoll(r => r + 1)
      if (roll === 2 || frameScore === 10) { setGame({ started: game.started, score: [] }); setRoll(0); setFrameScore(0) }
      generateScoreButtons();
      console.log(players);

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
    setPlayers(playersArray)
  }

  function pushScore(index) {
    setGame({ started: game.started, score: [...game.score, index] });
    setFrameScore(index)    
  }


  function generateScoreButtons() {

    let array = [];
    for (let index = 1; index <= 10 - frameScore; index++) {
      array.push(<button onClick={() => { pushScore(index) }}>{index}</button>)
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
