import React, { useState, useEffect } from 'react';
import '../styles/App.css';

import { makeStyles, withTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';




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
                let style;
                { player.id === game.currentPlayer.id && !game.finished ? style = { color: "white" } : style = { color: "black" } }
                const table = <Board {...result.body} frame={game.frame} frame10={player.frame10} style={style} ></Board >
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
            {/* <Board></Board> */}
        </>


    );
}


function Board(player) {

    const useStyles = makeStyles({
        table: {
            minWidth: 650,

        },
        header: {
            backgroundColor: '#0091ea',
            width: 100,
        },

    });



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
            <TableCell align="right">{roll1}:{roll2}</TableCell>)
        consecutiveScores.push(<TableCell align="right">{consecutiveScore}</TableCell>)
    }

    const classes = useStyles();

    const table = (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow className={classes.header}>
                        <TableCell className={classes.header}>Name </TableCell>
                        <TableCell align="right">1</TableCell>
                        <TableCell align="right">2</TableCell>
                        <TableCell align="right">3</TableCell>
                        <TableCell align="right">4</TableCell>
                        <TableCell align="right">5</TableCell>
                        <TableCell align="right">6</TableCell>
                        <TableCell align="right">7</TableCell>
                        <TableCell align="right">8</TableCell>
                        <TableCell align="right">9</TableCell>
                        <TableCell align="right">10</TableCell>
                        <TableCell align="right">Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key={player.name} >
                        <TableCell component="th" scope="row" style={player.style} className={classes.header}>
                            {player.name}
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
