const Scoreboard = require('./models/scoreboard');

let players = {

}

const gameRestart = () => {
    players = {

    }

}

const addPlayer = (name, id) => {
    players[id] = {
        name: name,
        scoresAray: [],
        consecutiveScoresArray: [],
        spare: false,
        strikeTotal: 0,
        frames: 1,
        gameOver: false,
        totalScore: 0
    }
}

const addScore = (rolls, id) => {

    

    if (players[id].strikeTotal >= 2) {
        const index = players[id].scoresAray.length - 2;
        players[id].scoresAray.splice(index, 1, [30]);
    }
    else if (players[id].strikeTotal === 1) {
        const index = players[id].scoresAray.length - 1;
        const result = rolls[0] + rolls[1] + 10;
        players[id].scoresAray.splice(index, 1, [result]);
    }
    else if (players[id].spare === true) {
        const index = players[id].scoresAray.length - 1;
        const result = rolls[0] + 10;
        players[id].scoresAray.splice(index, 1, [result]);
        players[id].spare = false;
    }

    if (rolls[0] === 10) {
        players[id].strikeTotal += 1;
    }
    else if (rolls[0] + rolls[1] === 10) {
        players[id].spare = true;
    }
    else {
        players[id].strikeTotal = 0;
    }

    players[id].scoresAray.push(rolls);
    const totalScore = totalBowlingScore(players[id].scoresAray);
    players[id].consecutiveScoresArray.push(totalScore);

    checkEndOfGame(players[id].frames, players[id].spare, players[id].strikeTotal, id);

    players[id].frames += 1;

    return players[id].scoresAray;
}

const updateUser = (id, roll) => {


    const myquery = { _id: new mongodb.ObjectID(id) };

    Scoreboard.updateOne(myquery
        , { $set: obj }, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(`Updates with ${obj}`);
                console.log(result);
            }
        });
}
    


const totalBowlingScore = (rollsArray) => {

    const totalScore = rollsArray
        .flat()
        .reduce((accumulator, currentValue) => accumulator + currentValue);

    return totalScore;
}

const checkEndOfGame = (frames, spare, strikeTotal, id) => {
    console.log(frames, spare, strikeTotal);

    if (frames === 10 && !spare && strikeTotal === 0) {
        players[id].gameOver = true;
    } // ! TODO perhaps just have else if frames > 11 gameover
    else if (frames === 11 && spare && strikeTotal === 0) {
        players[id].gameOver = true;
    }
    else if (frames === 11 && !spare && strikeTotal > 1) {
        players[id].gameOver = true;
    }
    else if (frames >= 11) {
        players[id].gameOver = true;
    }
}

const findPlayerByid = (id) => {
    const keys = Object.keys(players);
    const exists = keys.includes(id);
    return exists;
}

const getScores = (id) => {
    return players[id].scoresAray;
}

const getTotalScore = (id) => {
    return totalBowlingScore(players[id].scoresAray);
}

const getConsecutiveScores = (id) => {
    return players[id].consecutiveScoresArray;
}

const getFrames = (id) => {
    try {
        return players[id].frames;
    }
    catch (err) {
        return 0;
    }

}

const getGameOver = (id) => {
    return players[id].gameOver;
}

module.exports = {
    addScore,
    gameRestart,
    getTotalScore,
    getFrames,
    getScores,
    getConsecutiveScores,
    getGameOver,
    addPlayer,
    findPlayerByid,
    players
};

