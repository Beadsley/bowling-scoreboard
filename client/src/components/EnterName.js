import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert'
import '../styles/App.css';

function EnterName(game) {

    const alert = useAlert()


    const [boards, setBoards] = useState([]);

    useEffect(() => {

        if (game.players.length !== 0) {

            generateBoard();
        }
    }, [game.players, game.currentPlayer]);

    async function createPlayer(name) {

        const response = await fetch('/api/player/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name
            })
        })
        const { id } = await response.json();
        game.addPlayer(id, name)
    }

    async function fetchScores(id) {

        const response = await fetch(`/api/player/scores/${id}`)
        const result = await response.json();
        return result;

    }

    async function fetchTotalScore(id) {

        const response = await fetch(`/api/player/total/${id}`)
        const result = await response.json();
        return result;

    }

    async function fetchConsecutiveScores(id) {

        const response = await fetch(`/api/player/consecutiveScores/${id}`)
        const result = await response.json();
        return result;

    }

     function generateBoard() {
        
        if (game.started) {
            console.log('called');
            
            game.players.forEach(async (player) => {
                let array = [];
                console.log(player);
                
                const scores = await fetchScores(player.id);
                const consecutiveScores = await fetchConsecutiveScores(player.id);
                
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
    
                    array.push(
                        <div className="frame">
                            <div className="frame-element">{index + 1}</div>
                            {index === 10 ? <div className="roll frame-element"> <div>  </div><div>  </div> <div>  </div>  </div> : <div className="roll frame-element"><div>{roll1}</div><div> {roll2} </div></div>}
                            <div className="frame-element">{consecutiveScore}</div>
                        </div>
                    )
                }
                const total = await fetchTotalScore(player.id);
               // const { name } = game.players.find(player => player.id === game.currentPlayer.id);
    
                array.unshift(<div className="frame frame-element name"> {player.name}</div>)
                if (scores.error !== 'Game hasn\'t started yet!') {
                    array.push(<div className="frame frame-element"> {total}</div>)
                }
                else {
                    array.push(<div className="frame frame-element"> TOTAL</div>)
                }
                const index = boards.findIndex(board => board.id === player.id);
                console.log(index);
                console.log(array);
                
                boards.splice(index, 1, { id: player.id, score: array });

                
                setBoards([...boards]);
            });



        }
        // else if (game.frame === 1 && game.started) {
        //     for (let index = 1; index <= 10; index++) {
        //         array.push(
        //             <div className="frame">
        //                 <div className="frame-element">{index}</div>
        //                 {index === 10 ? <div className="roll frame-element"> <div>  </div><div>  </div> <div>  </div>  </div> : <div className="roll frame-element"><div>  </div><div>  </div></div>}
        //                 <div className="frame-element">{'score'}</div>
        //             </div>
        //         )
        //     }
        //     const { name } = game.players.find(player => player.id === game.currentPlayer.id);

        //     array.unshift(<div className="frame frame-element name"> {name}</div>)
        //     array.push(<div className="frame frame-element"> TOTAL</div>)
        //     const index = boards.findIndex(board => board.id == game.currentPlayer.id);
        //     boards.splice(index, 1, { id: game.currentPlayer.id, score: array });
        //     setBoards([...boards]);
        // }
        else {
            let array = [];
            for (let index = 1; index <= 10; index++) {
                array.push(
                    <div className="frame">
                        <div className="frame-element">{index}</div>
                        {index === 10 ? <div className="roll frame-element"> <div>  </div><div>  </div> <div>  </div>  </div> : <div className="roll frame-element"><div>  </div><div>  </div></div>}
                        <div className="frame-element">{'score'}</div>
                    </div>
                )
            }
            array.unshift(<div className="frame frame-element name"> {game.players[game.players.length - 1].name} </div>)
            array.push(<div className="frame frame-element"> TOTAL</div>)
            setBoards([...boards, { id: game.players[game.players.length - 1].id, score: array }]);
        }

    }

    return (
        <>
            <form style={game.started ? { display: "none" } : { display: "block" }} onSubmit={(e) => {
                e.preventDefault();
                createPlayer(e.target[0].value)

            }}>
                <input type="text" name="name" id="nameInput" required placeholder="Add a player..."
                    autoComplete="off" maxlength="10 " />
            </form>
            <button onClick={game.players.length !== 0 ? game.startGame : () => { alert.show('add a player...') }}>Start game</button>
            <div className="boards-container">
                {boards.map(board => <div className="board-container">{board.score}</div>)}
            </div>

        </>
    )
}

export default EnterName;
