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

        <div className="details-container" style={game.started ? { visibility: "hidden" } : { visibility: "visible" }}>
            <div className="name-input-container">
                <button className="add-player-btn" onClick={() => userInput.length !== 0 ? createPlayer(userInput) : alert.show('enter a name...')}>
                    <i className="material-icons">add</i>
                </button>
                <form onChange={handleUserInput} onSubmit={(e) => {
                    e.preventDefault();
                    createPlayer(userInput)
                }}>
                    <input className="name-input" type="text" name="name" id="nameInput" required placeholder="Add a player..."
                        autoComplete="off" maxLength="10 " />
                </form>
            </div>
            <button className="start-game-btn"
                onClick={game.players.length !== 0 ? game.startGame : () => { alert.show('add a player...') }}>Start game</button>
        </div>

    )
}

export default Input;