import React, { useState } from 'react';
import axios from "axios";
import { useAlert } from 'react-alert'
import { makeStyles, Input, InputLabel, InputAdornment, FormControl, Icon, Button } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Form from 'react-bootstrap/Form';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
}));

function InputPlayer(game) {
    const alert = useAlert();
    const [userInput, setUserInput] = useState('');
    const classes = useStyles();

    function handleUserInput(e) {
        setUserInput(e.target.value);
    }

    async function createPlayer(name) {
        const response = await axios.post('/api/player/', { name });        
        const { _id } = await response.data;
        game.addPlayer(_id, name);
    }

    return (
        <div className="input-container" style={game.started ? { visibility: "hidden" } : { visibility: "visible" }}>
            <Form className="form-container"
                onChange={handleUserInput}
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    createPlayer(userInput);
                    setUserInput("");
                }}>
                <FormControl className={classes.margin}
                    onChange={handleUserInput}
                    required>
                    <InputLabel htmlFor="input-with-icon-adornment" >Add a player...</InputLabel>
                    <Input
                        value={userInput}
                        autoComplete="off"
                        id="input-with-icon-adornment"
                        type="text"
                        inputProps={{
                            maxLength: 10
                        }}
                        startAdornment={
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        } />
                </FormControl>
                <Button type="submit" variant="outlined" color="primary">Submit</Button>
            </Form>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<Icon>send</Icon>}
                onClick={game.players.length !== 0 ? game.startGame : () => { alert.show('add a player...') }}>
                Start
            </Button>
        </div>
    )
}

export default InputPlayer;