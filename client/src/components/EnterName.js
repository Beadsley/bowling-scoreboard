import React, { useState, useEffect } from 'react';

function EnterName() {

    const [player, setPlayer] = useState([]);
    console.log(player);

    async function fetchData(name) {
        const response = await fetch('/api/player/', {
            method: 'post',
            body: JSON.stringify({
                name
            })
        })
        const { id } = await response.json();
        console.log(id);
        setPlayer([...player, { id, name }])
    }

    return (
        <>
        <form onSubmit={(e) => {
            e.preventDefault();
            fetchData(e.target[0].value)

        }}>
            <input type="text" name="name" id="nameInput" required placeholder="Add a to-do..."
                autoComplete="off" />
        </form>
        </>
    )
}



export default EnterName;
