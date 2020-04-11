import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Icon } from '@material-ui/core';

function Scoreboard(game) {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        if (game.players.length !== 0) {
            generateBoard();
        }
    }, [game.players, game.currentPlayer, game.scoreAdded]);

    useEffect(() => {
        if (game.restart) {
            setBoards([]);
        }
    }, [game.restart]);

    async function fetchPlayer(id) {
        const response = await fetch(`/api/player/${id}`)
        const result = await response.json();
        return result;
    }

    function generateBoard() {
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
            <h2>{game.finished && game.started ? "its all over!" : ""} </h2>
            <div className="boards-container">
                {boards.map(board => <div className="board-container">{board.score}</div>)}
            </div>
        </>
    );
}

function Board(player) {
    const useStyles = makeStyles(theme => ({
        table: {
            minWidth: 650,
            tableLayout:'fixed',
        },
        header: {
            backgroundColor: theme.palette.secondary.main,
            color: 'white',
            fontWeight: 900,
            width: 100,
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
        score: {
            overflow: "hidden",
        }
    }));
    const classes = useStyles();
    let scores = [];
    let consecutiveScores = [];
    for (let index = 0; index <= 9; index++) {
        let roll1 = "";
        let roll2 = "";
        let consecutiveScore = ".";
        if (player.scores !== undefined) {
            if (index < player.scores.length) {
                roll1 = player.scores[index][0]
                roll2 = player.scores[index][1]
                consecutiveScore = player.consecutiveScores[index]
            }
        }
        scores.push(player.frame === 11 && player.scores.length === 11 && index === 9 && player.frame10 !== 'nothing' ?
            <TableCell align="right">{roll1}:{player.scores[10][0]}:{player.scores[10][1]}</TableCell> :
            <TableCell align="right" className={classes.score}>{roll1}:{roll2}</TableCell>)
        consecutiveScores.push(<TableCell align="right" className={classes.score}>{consecutiveScore}</TableCell>)
    }

    const table = (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow className={classes.header}>
                        <TableCell className={classes.header}>Name </TableCell>
                        <TableCell className={classes["frame-header"]} align="right">1</TableCell>
                        <TableCell className={classes["frame-header"]} align="right">2</TableCell>
                        <TableCell className={classes["frame-header"]} align="right">3</TableCell>
                        <TableCell className={classes["frame-header"]} align="right">4</TableCell>
                        <TableCell className={classes["frame-header"]} align="right">5</TableCell>
                        <TableCell className={classes["frame-header"]} align="right">6</TableCell>
                        <TableCell className={classes["frame-header"]} align="right">7</TableCell>
                        <TableCell className={classes["frame-header"]} align="right">8</TableCell>
                        <TableCell className={classes["frame-header"]} align="right">9</TableCell>
                        <TableCell className={classes["frame-header"]} align="right">10</TableCell>
                        <TableCell className={classes.header} align="right">Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key={player.name}>
                        <TableCell component="th" scope="row" className={`${classes.header} ${classes.name}`}>
                            {player.isPlaying ? <><Icon>send</Icon>{player.name}</> : player.name}
                        </TableCell>
                        {scores}
                        <TableCell align="right">{player.totalScore}</TableCell>
                    </TableRow>
                    <TableRow key={player.name}>
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
