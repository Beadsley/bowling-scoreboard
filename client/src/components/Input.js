import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert'

function Input(game){

    const alert = useAlert()

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

    return (
        <>
            <div className="details">
                <form className="name-input" style={game.started ? { display: "none" } : { display: "block" }} onSubmit={(e) => {
                    e.preventDefault();
                    createPlayer(e.target[0].value)

                }}>
                    <input type="text" name="name" id="nameInput" required placeholder="Add a player..."
                        autoComplete="off" maxlength="10 " />
                </form>
                <button className="start-game-btn" style={game.started ? { display: "none" } : { display: "block" }} onClick={game.players.length !== 0 ? game.startGame : () => { alert.show('add a player...') }}>Start game</button>
            </div>
        </>
    )
}

export default Input;