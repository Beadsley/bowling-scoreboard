import React, { useState, useEffect } from 'react';
import '../styles/App.css';

function EnterName() {

    const [players, setPlayers] = useState([]);
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        generateBoard();
    }, []);

    async function fetchData(name) {

        const response = await fetch('/api/player/', {
            method: 'post',
            body: JSON.stringify({
                name
            })
        })
        const { id } = await response.json();
        setPlayers([...players, { id, name }])
    }

    function generateBoard() {
        let array = [];
        for (let index = 0; index <= 10; index++) {
            array.push(
                <div className="frame">
                    <div className="frame-element">{index}</div>
                    {index === 10 ? <div class="roll frame-element"> <div> 6 </div><div> 7 </div> <div> 8 </div>  </div> : <div class="roll frame-element"><div> 6 </div><div> 7 </div></div>}
                    <div className="frame-element">{'score'}</div>
                </div>
            )
        }
        array.unshift(<div className="frame frame-element"> NAME</div>)
        array.push(<div className="frame frame-element"> TOTAL</div>)
        setBoards(array);
    }

    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault();
                fetchData(e.target[0].value)

            }}>
                <input type="text" name="name" id="nameInput" required placeholder="Add a player..."
                    autoComplete="off" />
            </form>
            {players.map((x, i) => <div key={i} className="player-container"> {x.name}</div>)}
            <div className="board-container">
                {boards}
            </div>

        </>
    )
}

export default EnterName;
