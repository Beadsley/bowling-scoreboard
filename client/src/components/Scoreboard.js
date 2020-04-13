import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../styles/App.css';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Icon } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 1000,
        tableLayout: 'fixed',
    },
    header: {
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
        fontWeight: 900,
        width: 100,
        height: 30,
    },
    'frame-header': {
        color: 'white',
        fontWeight: 900,
    },
    name: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    roll: {
        borderWidth: ' 0.0625rem',
        borderStyle: 'solid',
        borderColor: `${theme.palette.secondary.main} #ccc`
    }
}));

function Scoreboard(game) {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        if (game.players.length !== 0) {
            generateBoards();
        }
    }, [game.players]);

    useEffect(() => {
        if (game.started) {
            generateBoards();
        }
    }, [game.currentPlayer, game.finished]);

    useEffect(() => {
        if (game.restart) {
            setBoards([]);
        }
    }, [game.restart]);

    async function fetchPlayer(id) {
        const response = await axios.get(`/api/player/${id}`)
        const result = await response.data;
        return result;
    }

    function generateBoards() {
        game.players.forEach(async (player, index) => {

            if (game.started) {
                const result = await fetchPlayer(player.id);
                const isPlaying = player.id === game.currentPlayer.id && !game.finished;
                const table = <Board {...result.body} frame={game.frame} frame10={player.frame10} isPlaying={isPlaying} ></Board >
                const index = boards.findIndex(board => board.id === player.id);
                boards.splice(index, 1, { id: player.id, score: table });
                setBoards([...boards]);
            }
            else if ((game.players.length - 1 === index)) {
                const table = <Board {...player}></Board>
                setBoards([...boards, { id: player.id, score: table }]);
            }
        });
    }
    return (
        <>
            <h2>{game.currentPlayer && !game.finished && game.started ? game.currentPlayer.name + " your up!" : ""} </h2>
            <h2>{game.finished && game.started ? "It's all over!" : ""} </h2>
            <div className="boards-container">
                {boards.map((board, i) => <div key={i} className="board-container">{board.score}</div>)}
            </div>
        </>
    );
}

function useScores(player) {
    const classes = useStyles();
    let scores = [];
    let consecutiveScores = [];
    for (let index = 0; index <= 9; index++) {
        const frame10extraRoll = player.frame === 11 && player.scoreboardScores.length === 11 && index === 9 && player.frame10 !== 'nothing';
        let roll1 = "";
        let roll2 = "";
        let consecutiveScore = "";
        if (player.scoreboardScores !== undefined) {
            if (index < player.scoreboardScores.length) {
                roll1 = player.scoreboardScores[index][0]
                roll2 = player.scoreboardScores[index][1]
                consecutiveScore = player.consecutiveScores[index]
                if (roll1 === 10) {
                    roll1 = "X";
                    roll2 = "";
                }
                else if (roll1 + roll2 === 10) {
                    roll2 = `/`
                }
            }
        }

        if (frame10extraRoll && player.frame10 === 'strike') {
            const frame10roll1 = player.scoreboardScores[10][0];
            const frame10roll2 = player.scoreboardScores[10][1];
            scores.push(<TableCell className={classes.roll} align="right">{roll1}</TableCell>);
            scores.push(<TableCell className={classes.roll} align="center">{frame10roll1 === 10 ? "X" : frame10roll1}</TableCell>);
            scores.push(<TableCell className={classes.roll} align="left">{frame10roll2 === 10 ? "X" : frame10roll2}</TableCell>);
            consecutiveScores.push(<TableCell align="center" colSpan="3">{consecutiveScore}</TableCell>);
        }
        else if (frame10extraRoll && player.frame10 === 'spare') {
            scores.push(<TableCell className={classes.roll} align="right">{roll1}</TableCell>);
            scores.push(<TableCell className={classes.roll} align="center">{roll2}</TableCell>);
            scores.push(<TableCell className={classes.roll} align="left">{player.scoreboardScores[10][0]}</TableCell>);
            consecutiveScores.push(<TableCell align="center" colSpan="3">{consecutiveScore}</TableCell>);
        }
        else if (index === 9) {
            scores.push(<TableCell className={classes.roll} align="right">{roll1}</TableCell>);
            scores.push(<TableCell className={classes.roll} align="left">{roll2}</TableCell>);
            scores.push(<TableCell className={classes.roll} align="center"></TableCell>);
            consecutiveScores.push(<TableCell align="center" colSpan="3">{consecutiveScore}</TableCell>);
        } else {
            scores.push(<TableCell className={classes.roll} align="right">{roll1}</TableCell>);
            scores.push(<TableCell className={classes.roll} align="left">{roll2}</TableCell>);
            consecutiveScores.push(<TableCell align="center" colSpan="2">{consecutiveScore}</TableCell>);
        }
    }
    return {
        scores,
        consecutiveScores
    }
}

function Board(player) {
    const classes = useStyles();
    const { scores, consecutiveScores } = useScores(player);
    
    const table = (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow className={classes.header}>
                        <TableCell className={classes.header}>Name </TableCell>
                        <TableCell className={classes["frame-header"]} align="center" colSpan="2">1</TableCell>
                        <TableCell className={classes["frame-header"]} align="center" colSpan="2">2</TableCell>
                        <TableCell className={classes["frame-header"]} align="center" colSpan="2">3</TableCell>
                        <TableCell className={classes["frame-header"]} align="center" colSpan="2">4</TableCell>
                        <TableCell className={classes["frame-header"]} align="center" colSpan="2">5</TableCell>
                        <TableCell className={classes["frame-header"]} align="center" colSpan="2">6</TableCell>
                        <TableCell className={classes["frame-header"]} align="center" colSpan="2">7</TableCell>
                        <TableCell className={classes["frame-header"]} align="center" colSpan="2">8</TableCell>
                        <TableCell className={classes["frame-header"]} align="center" colSpan="2">9</TableCell>
                        <TableCell className={classes["frame-header"]} align="center" colSpan="3">10</TableCell>
                        <TableCell className={classes.header} align="right">Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell component="th" scope="row" className={`${classes.header} ${classes.name}`}>
                            {player.isPlaying ? <><Icon>send</Icon>{player.name}</> : player.name}
                        </TableCell>
                        {scores}
                        <TableCell align="right">{player.totalScore}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell component="th" scope="row" className={classes.header}></TableCell>
                        {consecutiveScores}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
    return table;
}

export default Scoreboard;
