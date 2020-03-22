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
    player.body.totalScore = totalScore;

    player = checkEndOfGame(player);

    player.body.frames += 1;
    console.log('after ', player);
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
    console.log(frames, spare, strikeTotal);

    if (frames === 10 && !spare && strikeTotal === 0) {
        player.body.gameOver = true;
    } // ! TODO perhaps just have else if frames > 11 gameover
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

