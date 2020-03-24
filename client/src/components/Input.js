import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert'

function Input(game) {

    const alert = useAlert()
    const [userInput, setUserInput] = useState('');

    function handleUserInput(e) {

        setUserInput(e.target.value)

    }

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
        const { _id } = await response.json();
        game.addPlayer(_id, name)
    }

    return (
        <>
            <div className="details">
                <button className="add-player-btn" onClick={() => userInput.length !== 0 ? createPlayer(userInput) : alert.show('enter a name...')}
                    style={game.started ? { visibility: "hidden" } : { visibility: "visible" }}>
                    <i className="material-icons">add</i>
                </button>
                <form style={game.started ? { visibility: "hidden" } : { visibility: "visible" }} onChange={handleUserInput} onSubmit={(e) => {
                    e.preventDefault();
                    createPlayer(userInput)
                }}>
                    <input className="name-input" type="text" name="name" id="nameInput" required placeholder="Add a player..."
                        autoComplete="off" maxlength="10 " />
                </form>
                <button className="start-game-btn" style={game.started ? { visibility: "hidden" } : { visibility: "visible" }}
                    onClick={game.players.length !== 0 ? game.startGame : () => { alert.show('add a player...') }}>Start game</button>
            </div>
        </>
    )
}

export default Input;