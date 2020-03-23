import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert'
import '../styles/App.css';

function EnterName(game) {

    const alert = useAlert()


    const [boards, setBoards] = useState([]);

    useEffect(() => {

        if (game.players.length !== 0) {
            console.log(game.players);

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

            let board = [];
            const result = await fetchPlayer(player.id);
            const { scores, consecutiveScores, totalScore, name } = result.body;

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

                board.push(
                    <div className="frame">
                        <div className="frame-element">{index + 1}</div>
                        {game.frame === 12 && (player.frame10Spare === true || player.frame10Strike === true) && index === 9 ?
                            <div className="roll frame-element"> <div> {roll1} </div><div> {scores[10][0]} </div> <div> {scores[10][1]}</div></div> :
                            <div className="roll frame-element"><div> {roll1} </div><div> {roll2} </div></div>}
                        <div className="frame-element">{consecutiveScore}</div>
                    </div>
                )
            }

            board.unshift(<div className="frame-element name"> {name}</div>)
            board.push(<div className="total frame-element"> Total:{totalScore}</div>)

            if (game.started) {
                const index = boards.findIndex(board => board.id === player.id);
                boards.splice(index, 1, { id: player.id, score: board });
                setBoards([...boards]);
            }
            else if ((game.players.length - 1 === index)) {
                setBoards([...boards, { id: player.id, score: board }]);
            }
        });

    }

    return (
        <>

            <div className="boards-container">
                {console.log(boards)}
                {boards.map(board => <div className="board-container">{board.score}</div>)}
            </div>

        </>
    )
}

export default EnterName;
