import React, { useState, useEffect } from 'react';

function EnterScore() {

  const [score, setScore] = useState([]);
  const [roll, setRoll] = useState(0);
  const [frameScore, setFrameScore] = useState(0);
  const [buttons, setButtons] = useState([]);


  useEffect(() => {
    setRoll(r => r + 1)
    if (roll === 2 || frameScore === 10) { setScore([]); setRoll(0); setFrameScore(0) }
    generateScoreButtons();
  }, [score]);

  function generateScoreButtons() {
    
    let array = [];
    for (let index = 0; index <= 10 - frameScore; index++) {
      array.push(<button onClick={() => { setScore([...score, index]); setFrameScore(index) }}>{index}</button>)
    }
    setButtons(array);
  }

  return (
    <>
      {buttons}
    </>
  );
}

export default EnterScore;
