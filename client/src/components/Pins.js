import React, { useState, useEffect } from 'react';

function Pins(game) {

    const [buttons, setButtons] = useState([]);

    useEffect(() => {
        if (game.started) {
            generateScoreButtons();
        }
    }, [game.score, game.currentPlayer])

    function generateScoreButtons() {

        let pins = [];
        for (let pin = 0; pin <= 10 - game.frameScore; pin++) {

            pins.push(<button onClick={() => {
                game.update(pin);
            }
            }> {pin}</button >)
        }
        setButtons(pins);
    }

    return (
        buttons
    )
}

export default Pins;