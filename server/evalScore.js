const { getDocument, updateDocument, removeAll, insertDocument } = require('./models/dbHelper.js');

const addScore = async (rolls, id, player) => {

    
    console.log('before ', player);
    player.body.strikeTotal
    if (player.body.strikeTotal >= 2) {
        const index = player.body.scoresAray.length - 2;
        player.body.scoresAray.splice(index, 1, [30]);
    }
    else if (player.body.strikeTotal === 1) {
        const index = player.body.scoresAray.length - 1;
        const result = rolls[0] + rolls[1] + 10;
        player.body.scoresAray.splice(index, 1, [result]);
    }
    else if (player.body.spare === true) {
        const index = player.body.scoresAray.length - 1;
        const result = rolls[0] + 10;
        player.body.scoresAray.splice(index, 1, [result]);
        player.body.spare = false;
    }

    if (rolls[0] === 10) {
        player.body.strikeTotal += 1;
    }
    else if (rolls[0] + rolls[1] === 10) {
        player.body.spare = true;
    }
    else {
        player.body.strikeTotal = 0;
    }

    player.body.scoresAray.push(rolls);
    const totalScore = totalBowlingScore(player.body.scoresAray);
    player.body.consecutiveScoresArray.push(totalScore);

    //checkEndOfGame(players[id].frames, players[id].spare, players[id].strikeTotal, id);

    player.body.frames += 1;
    console.log('after ', player);
    return player;
    //return players[id].scoresAray;
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
    getTotalScore,
    getFrames,
    getScores,
    getConsecutiveScores,
    getGameOver,
    findPlayerByid,
};

