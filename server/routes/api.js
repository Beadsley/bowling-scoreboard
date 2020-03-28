const express = require('express');
const router = express.Router();
const { addScore } = require('../evalScore.js');
const { getDocument, getDocuments, removeAll, insertDocument, updateDocument, removeDocument } = require('../models/dbhelper.js');


router.get('/players', async(req, res) => {

    try {
        const players = await getDocuments()
        res.status(200).json(players);
    }
    catch (err) {
        res.status(400).send({ message: err }); //maybe not 400
    }
});

router.delete('/game', async (req, res) => {

    try {
        await removeAll()
        res.status(204).end();
    }
    catch (err) {
        res.status(400).send({ message: err }); //maybe not 400
    }
    
});

router.delete('/player/:id', async (req, res) => {
console.log('hereeeeeeeeee');

    const id = req.params.id;
    try {
        await removeDocument(id);        
        res.status(204).end();
    }
    catch (err) {
        
        res.status(400).send({ message: err }); //maybe not 400
    }
    
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

    const id = req.params.id;
    const score = req.body.roll;
    
    try {
        let player = await getDocument(id);        
        const { frames, gameOver } = player.body;
        const valid = validation(score, frames);
        if (valid && !gameOver) {
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
        } else {
            res.status(400).send({ error: err.message });
        }
    }
});

const validation = (scores, _frame) => {
    if (!Array.isArray(scores)) {
        throw new Error('`request body must contain {roll: [roll_1, roll_2]}`');        
    }
    else if (scores.length !== 2) {
        throw new Error('array should contain 2 arguments');
    }
    else if ((typeof scores[0] !== 'number') || (typeof scores[1] !== 'number')) {
        throw new Error('array should only contain numbers');
    }
    else if (scores[0] + scores[1] > 10 && _frame < 11) {
        throw new Error('frame total shouldn\'t be higher than 10');
    }
    else if (scores[0] + scores[1] > 20 && _frame === 11) {
        throw new Error('frame total shouldn\'t be higher than 20');
    }
    else {
        return true;
    }
}

module.exports.validation = validation;
module.exports = router;