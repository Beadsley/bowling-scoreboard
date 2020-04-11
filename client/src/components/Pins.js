import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

function Pins(game) {
    const [buttons, setButtons] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        if (game.started) {
            generateScoreButtons();
        }
    }, [game.score, game.currentPlayer])

    function generateScoreButtons() {

        let pins = [];
        for (let pin = 0; pin <= 10 - game.frameScore; pin++) {

            pins.push(
                <div className={classes.root} >
                    <Button variant="contained" color="primary"
                        onClick={() => {
                            game.update(pin);
                        }}>
                        {pin}
                    </Button>
                </div>
            )
        }
        setButtons(pins);
    }

    return (
        <>
            <h2>Click Number of Pins Knocked Down!</h2>
            <div className="pins-container">
                {buttons}
            </div>
        </>
    )
}

export default Pins;

