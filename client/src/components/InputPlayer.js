import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert'
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Form from 'react-bootstrap/Form';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
}));

function InputPlayer(game) {

    const alert = useAlert()
    const [userInput, setUserInput] = useState('');
    const classes = useStyles();

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
                <Button type="submit" variant="outlined" color="primary" style={{ color: '#00363a' }} >Submit</Button>
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