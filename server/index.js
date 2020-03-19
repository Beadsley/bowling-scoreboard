const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid').v1;
const morgan = require('morgan')
const { addScore, gameRestart, getTotalScore, getFrames, getScores, getConsecutiveScores, getGameOver, addPlayer, findPlayerByid } = require('./evalScore.js');

const app = express();

app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT=process.env.PORT || 8080
console.log(PORT);

app.listen(PORT, () => {

    console.log(`running om port: ${PORT}`);

});

/**
 * gets the scores of each frame played
 * player id needs to be specified
 */
app.get('/api/player/scores/:id', (req, res) => {

    const id = req.params.id;
    const exists = findPlayerByid(id);

    if (!exists) {
        res.status(400).send({ error: `player with id: [${id}] doesn\'t exist` });
    }
    else if (getFrames(id) !== 1) {
        const scores = getScores(id);
        res.status(200).json(scores);
    }
    else {
        res.status(400).send({ error: 'Game hasn\'t started yet!' });
    }
});

/**
 * gets the consecutivetotal for each frame played
 * player id needs to be specified
 */
app.get('/api/player/consecutiveScores/:id', (req, res) => {

    const id = req.params.id;
    const exists = findPlayerByid(id);

    if (!exists) {
        res.status(400).send({ error: `player with id: [${id}] doesn\'t exist` });
    }
    else if (getFrames(id) !== 1) {
        const consecScores = getConsecutiveScores(id);
        res.status(200).json(consecScores);
    }
    else {
        res.status(400).send({ error: 'Game hasn\'t started yet!' });
    }
});
/**
 * gets the total number of points
 * player id needs to be specified
 */
app.get('/api/player/total/:id', (req, res) => {

    const id = req.params.id;
    const exists = findPlayerByid(id);

    if (!exists) {
        res.status(400).send({ error: `player with id: [${id}] doesn\'t exist` });
    }
    else if (getFrames(id) !== 1) {
        const totalScore = getTotalScore(id);
        res.status(200).json(totalScore);
    }
    else {
        res.status(400).send({ error: 'Game hasn\'t started yet!' });
    }
});

/**
 * restarts the game and deletes all scores
 */
app.delete('/api/game', (req, res) => {

    gameRestart();
    res.status(204).end();
});

/**
 * Creates a player. a name has to be specified in the
 * req.body, as below:
 * 
 *  {
 *      name: "name"
 *  }
 */
app.post('/api/player', (req, res) => {

    const name = req.body.name;
    const id = uuid();
    addPlayer(name, id);
    res.status(200).json({ id: id, name: name });

});

/**
 * adds a score from a frame to the scores array.
 * player id needs to be specified.
 * the input in the req.body must be of type array containing 
 * two arguments    (typeof number) representing the rolls of a frame: 
 * 
 *  { 
 *      "roll": [roll_1, roll_2]
 *  }
 * 
 */
app.put('/api/player/score/:id', (req, res) => {
    // !TODO introduce players
    const id = req.params.id;
    const score = req.body.roll;
    const validate = validation(score, getFrames(id));
    const exists = findPlayerByid(id);

    if (!exists) {
        res.status(400).send({ error: `player with id: [${id}] doesn\'t exist` });
    }
    else if (score === undefined) {
        res.status(400).send({ error: `request body must contain {roll: [roll_1, roll_2]}` });
    }
    else if (!getGameOver(id) && validate === 'valid') {
        addScore(score, id);
        res.status(200).json({ frame: getFrames(id) - 1, score: score });
    }
    else if (!getGameOver(id) && validate !== 'valid') {
        res.status(400).send({ error: validate });
    }
    else {
        res.status(400).send({ error: 'Game over' });
    }
});

const validation = (scores, _frame) => {
    if (!Array.isArray(scores)) {
        return 'must be of type array';
    }
    else if (scores.length !== 2) {
        return 'array should contain 2 arguments';
    }
    else if ((typeof scores[0] !== 'number') || (typeof scores[1] !== 'number')) {
        return 'array should only contain numbers';
    }
    else if (scores[0] + scores[1] > 10 && _frame < 11) {
        return 'frame total shouldn\'t be higher than 10';
    }
    else if (scores[0] + scores[1] > 20 && _frame === 11) {
        return 'frame total shouldn\'t be higher than 20';
    }
    else {
        return 'valid';
    }
}

module.exports.validation = validation;