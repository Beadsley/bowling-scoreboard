const addScore = async (rolls, player) => {
    if (player.body.strikeTotal >= 2) {
        const index = player.body.scores.length - 2;
        player.body.scores.splice(index, 1, [30]);
    }
    else if (player.body.strikeTotal === 1) {
        const index = player.body.scores.length - 1;
        const result = rolls[0] + rolls[1] + 10;
        player.body.scores.splice(index, 1, [result]);
    }
    else if (player.body.spare === true) {
        const index = player.body.scores.length - 1;
        const result = rolls[0] + 10;
        player.body.scores.splice(index, 1, [result]);
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
    
    player.body.scores.push(rolls);
    player.body.scoreboardScores.push(rolls);
    const totalScore = totalBowlingScore(player.body.scores);
    player.body.consecutiveScores.push(totalScore);
    player.body.totalScore = totalScore;

    player = checkEndOfGame(player);

    player.body.frames += 1;
    return player;
}

const totalBowlingScore = (rollsArray) => {
    const totalScore = rollsArray
        .flat()
        .reduce((accumulator, currentValue) => accumulator + currentValue);
    return totalScore;
}

const checkEndOfGame = (player) => {
    const { frames, spare, strikeTotal } = player.body

    if (frames === 10 && !spare && strikeTotal === 0) {
        player.body.gameOver = true;
    }
    else if (frames === 11 && spare && strikeTotal === 0) {
        player.body.gameOver = true;
    }
    else if (frames === 11 && !spare && strikeTotal > 1) {
        player.body.gameOver = true;
    }
    else if (frames >= 11) {
        player.body.gameOver = true;
    }
    return player;
}

module.exports = {
    addScore,
};

