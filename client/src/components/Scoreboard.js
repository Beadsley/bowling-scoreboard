import React, { useState, useEffect } from 'react';
import '../styles/App.css';

function EnterName(game) {

    const [boards, setBoards] = useState([]);

    useEffect(() => {


        if (game.players.length !== 0) {
            console.log('frame', game.frame);
            generateBoard();
        }
    }, [game.players, game.currentPlayer]);


    async function fetchPlayer(id) {

        const response = await fetch(`/api/player/${id}`)
        const result = await response.json();
        return result;

    }


    function generateBoard() {

        game.players.forEach(async (player, index) => {

            let row1 = []
            let row2 = []
            let row3 = []
            const result = await fetchPlayer(player.id);
            const { scores, consecutiveScores, totalScore, name } = result.body;
            console.log('strike', player.frame10Strike, scores.length);

            for (let index = 0; index <= 9; index++) {
                let roll1 = "";
                let roll2 = "";
                let consecutiveScore = ".";

                if (scores.error !== 'Game hasn\'t started yet!') {
                    if (index < scores.length) {
                        roll1 = scores[index][0]
                        roll2 = scores[index][1]
                        consecutiveScore = consecutiveScores[index]
                    }
                }
                row1.push(<th>{index + 1}</th>)
                row2.push(game.frame === 11 && scores.length === 11 && index === 9 && (player.frame10Spare === true || player.frame10Strike === true) ?
                    <td>{roll1}:{scores[10][0]}:{scores[10][1]}</td> :
                    <td>{roll1}:{roll2}</td>)
                row3.push(<td>{consecutiveScore}</td>)

            }
            row1.unshift(<th>name</th>)
            row1.push(<th>total</th>)
            row2.unshift(<th>{name}</th>)
            row2.push(<td>{totalScore}</td>)
            row3.unshift(<th></th>)
            row3.push(<td></td>)
            const table = <table><tbody><tr>{row1}</tr><tr>{row2}</tr><tr>{row3}</tr></tbody></table>

            if (game.started) {
                const index = boards.findIndex(board => board.id === player.id);
                boards.splice(index, 1, { id: player.id, score: table });
                setBoards([...boards]);
            }
            else if ((game.players.length - 1 === index)) {
                setBoards([...boards, { id: player.id, score: table }]);
            }
        });

    }

    return (
        <>
            <h2>{game.currentPlayer && !game.over() && game.started ? game.currentPlayer.name + " your up!" : ""} </h2>
            <h2>{game.over() && game.started ? "its all over!" : ""} </h2>
            <div className="boards-container">
                {boards.map(board => <div className="board-container">{board.score}</div>)}
            </div>

        </>
    )
}

export default EnterName;
