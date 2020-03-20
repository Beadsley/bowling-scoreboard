import React, { useState, useEffect } from 'react';
import '../styles/App.css';

function EnterName(game) {

    const [player, setPlayer] = useState();
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        console.log('game', game.started, game.currentPlayer);

        if (player) {
            generateBoard();
        }
    }, [player]);

    useEffect(() => {

    }, [game.frame]);

    async function addPlayer(name) {

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
        setPlayer({ id, name })


    }

    function generateBoard() {
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
        array.unshift(<div className="frame frame-element name"> {player.name}</div>)
        array.push(<div className="frame frame-element"> TOTAL</div>)
        setBoards([...boards, array]);
    }

    return (
        <>
            <form style={game.started ? { display: "none" } : { display: "block" }} onSubmit={(e) => {
                e.preventDefault();
                addPlayer(e.target[0].value)

            }}>
                <input type="text" name="name" id="nameInput" required placeholder="Add a player..."
                    autoComplete="off" maxlength="10 " />
            </form>
            <div className="boards-container">
                {boards.map(board => <div className="board-container">{board}</div>)}
            </div>

        </>
    )
}

export default EnterName;
