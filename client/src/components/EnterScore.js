import React, { useState, useEffect } from 'react';
import EnterName from './EnterName';

function EnterScore() {

  const [buttons, setButtons] = useState([]);
  const [game, setGame] = useState({ started: false, roll: 0, score: [], frame: 1, frameScore: 0, currentPlayer: undefined });
  const [players, setPlayers] = useState([]);

  useEffect(() => {

    if (game.started && game.currentPlayer !== undefined) {
      //console.log('frame', game.frame, 'prevframesscore: ', game.frameScore, 'roll: ', game.roll, game.currentPlayer);

      if (game.frameScore === 10 && game.roll === 1 && game.frame < 11) {
        // strike
        setGame({ started: game.started, roll: game.roll + 1, score: [10, 0], frame: game.frame, frameScore: game.frameScore, currentPlayer: game.currentPlayer })
      }
      else if (game.frame === 11) {
        const index = players.findIndex(player => player.id == game.currentPlayer);
        if (game.roll === 1 && players[index].frame10Strike === false) {
          // spare 
          setGame({ started: game.started, roll: game.roll + 1, score: [game.frameScore, 0], frame: game.frame, frameScore: game.frameScore, currentPlayer: game.currentPlayer })
        }
        else if (players[index].frame10Strike === true) {
          //strike
          console.log('strike baby');

        }
      }
      // else if(game.frame === 11 && game.frameScore!==10){ 
      //   setGame({ started: game.started, roll: game.roll + 1, score: [game.frameScore, 0], frame: game.frame, frameScore: game.frameScore, currentPlayer: game.currentPlayer })
      // }
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
      //fetchPlayers();
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
        playing: false,
        frame10Strike: false,
        frame10Spare: false
      })
    }
    setPlayers(playersArray) // add players to the game array
    setGame({ started: game.started, roll: game.roll, score: game.score, frame: game.frame, frameScore: game.frameScore, currentPlayer: playersArray[0].id })

  }

  //selects the first player
  function selectPlayer() {
    setGame({ started: game.started, roll: game.roll, score: game.score, frame: game.frame, frameScore: game.frameScore, currentPlayer: players[0].id })
    
  }

  function addPlayer(id, name) {
    const player = {
      id,
      name,
      playing: false,
      frame10Strike: false,
      frame10Spare: false
    }
    setPlayers([...players, player])
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

      array.push(<button onClick={() => {
        const currentPlayerIndex = players.findIndex(player => player.id == game.currentPlayer);
        if (game.frame === 10 && index === 10) {
          players[currentPlayerIndex].frame10Strike = true;
          setPlayers([...players]);
        }
        let strikeRound11 = false;
        if (players[currentPlayerIndex].frame10Strike === true && game.frame === 11 && index === 10) {
          // strike thrown on frame 11
          strikeRound11 = true;

        }

        setGame({
          started: game.started,
          roll: game.roll + 1,
          score: [...game.score, index],
          frame: game.frame,
          frameScore: strikeRound11 ? 0 : index,
          currentPlayer: game.currentPlayer
        })
      }}>{index}</button>)
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
      <EnterName {...game} startGame={startGame} addPlayer={addPlayer} players={players}/>
    </>
  );
}

export default EnterScore;
