import React, { useState, useEffect } from 'react';
import EnterName from './EnterName';

function EnterScore() {

  const [score, setScore] = useState([]);
  const [roll, setRoll] = useState(0);
  const [frameScore, setFrameScore] = useState(0);
  const [buttons, setButtons] = useState([]);
  const [gameStarted, setgameStarted] = useState({ started: false });


  useEffect(() => {

    setRoll(r => r + 1)
    if (roll === 2 || frameScore === 10) { setScore([]); setRoll(0); setFrameScore(0) }
    generateScoreButtons();
    fetchPlayers();
    // eslint-disable-next-line
  }, [score]);

  async function fetchPlayers() {

    const response = await fetch('/api/players')
    const result = await response.json();
    console.log(result);


  }

  function generateScoreButtons() {

    let array = [];
    for (let index = 1; index <= 10 - frameScore; index++) {
      array.push(<button onClick={() => { setScore([...score, index]); setFrameScore(index) }}>{index}</button>)
    }
    setButtons(array);
  }


  return (
    <>
      {buttons}
      <button onClick={() => setgameStarted({ started: true })}>StartGame</button>
      <EnterName {...gameStarted} />
    </>
  );
}

export default EnterScore;
