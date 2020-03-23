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

            let column1 = []
            let column2 = []
            let column3 = []
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
                column1.push(<th>{index + 1}</th>)
                column2.push(<td>{roll1} : {roll2} </td>)
                column3.push(<td>{consecutiveScore} </td>)

            }
            column1.unshift(<th>name</th>)
            column1.push(<th>total</th>)
            column2.unshift(<th>{name}</th>)
            column2.push(<th>{totalScore}</th>)
            column3.unshift(<th></th>)
            const table= <table> <tr> {column1}</tr> <tr>{column2} </tr><tr>{column3} </tr></table>

            if (game.started) {
                const index = boards.findIndex(board => board.id === player.id);
                boards.splice(index, 1, {id: player.id, score: table });
                setBoards([...boards]);
            }
            else if ((game.players.length - 1 === index)) {
                    setBoards([...boards, { id: player.id, score: table }]);
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
