const express = require('express');
const router = express.Router();
const { addScore, gameRestart, getTotalScore, getFrames, getScores, getConsecutiveScores, getGameOver, addPlayer, findPlayerByid, players } = require('../evalScore.js');
const uuid = require('uuid').v1;
const Scoreboard = require('../models/scoreboard');
const { getDocument, removeAll, insertDocument, updateDocument } = require('../models/dbHelper.js');

//test route for db all platers
router.get('/', (req, res) => {
    Scoreboard.find({}).then(data => {
        res.status(200).json(data);

    })
});
/**
 * gets the scores of each frame played
 * player id needs to be specified
 */
router.get('/player/scores/:id', (req, res) => {

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
router.get('/player/consecutiveScores/:id', (req, res) => {

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
router.get('/player/total/:id', (req, res) => {

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
router.delete('/game', async (req, res) => {

    try {
        await removeAll()
        res.status(204).end();
    }
    catch (err) {
        res.status(400).send({ message: err }); //maybe not 400
    }

    //gameRestart();
});


router.get('/player/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const player = await getDocument(id);
        res.json(player);
    }
    catch (err) {
        res.status(400).send({ error: `player with id: [${id}] doesn\'t exist` });
    }

})

/**
 * Creates a player. a name has to be specified in the
 * req.body, as below:
 * 
 *  {
 *      name: "name"
 *  }
 */
router.post('/player', async (req, res) => {

    const name = req.body.name;

    if (name === undefined) {
        res.status(400).send({ error: `must be in the format {name:'charlie'}` });
    }

    try {
        const player = await insertDocument(name);
        res.json(player);
    }
    catch (err) {
        res.status(400).send({ error: err });
    }

});

router.get('/players', (req, res) => {
    res.status(200).json(players);
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
router.put('/player/score/:id', async (req, res) => {
    // !TODO introduce players
    const id = req.params.id;
    const score = req.body.roll;
    try {
        let player = await getDocument(id);
        const { frames, gameOver } = player.body;
        const valid = validation(score, frames, res);
        if (valid && !gameOver){
            const updatedPlayer = await addScore(score, id, player);
            await updateDocument(id, updatedPlayer);
            res.json(updatedPlayer);
        }
        else {
            res.status(400).send({ error: 'Game over' });
        }

    }
    catch (err) {
        if (err.kind === "ObjectId") {
            res.status(400).send({ error: `player with id: [${id}] doesn\'t exist` });
        }
        res.status(400).send({ error: err });
    }
});

// perhaps throw an error instead
const validation = (scores, _frame, res) => {
    if (!Array.isArray(scores)) {
        res.status(400).send({ error: `request body must contain {roll: [roll_1, roll_2]}` });
    }
    else if (scores.length !== 2) {
        res.status(400).send({ error: 'array should contain 2 arguments' });

    }
    else if ((typeof scores[0] !== 'number') || (typeof scores[1] !== 'number')) {
        res.status(400).send({ error: 'array should only contain numbers' });
        
    }
    else if (scores[0] + scores[1] > 10 && _frame < 11) {
        res.status(400).send({ error: 'frame total shouldn\'t be higher than 10' });
        
    }
    else if (scores[0] + scores[1] > 20 && _frame === 11) {
        res.status(400).send({ error: 'frame total shouldn\'t be higher than 20' })
    }
    else {
        return true;
    }
}

module.exports.validation = validation;
module.exports = router;