const { addScore } = require('../services/service.evalscore.js');
const { getDocument, getDocuments, insertDocument, updateDocument, removeDocument } = require('../models/dbhelper.js');
const { validation } = require('../services/service.validatescore');

const getPlayers = async (_req, res) => {
  try {
    const players = await getDocuments();
    res.status(200).json(players);
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

const getPlayer = async (req, res) => {
  const id = req.params.id;
  try {
    const player = await getDocument(id);
    res.json(player);
  } catch (err) {
    res.status(400).send({ error: `player with id: [${id}] doesn\'t exist` });
  }
};

const deletePlayer = async (req, res) => {
  const id = req.params.id;
  try {
    await removeDocument(id);
    res.status(204).end();
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

const createPlayer = async (req, res) => {
  const name = req.body.name;
  if (name === undefined) {
    res.status(400).send({ error: `must be in the format {name:'charlie'}` });
  }
  try {
    const player = await insertDocument(name);
    res.json(player);
  } catch (err) {
    res.status(400).send({ error: err });
  }
};

const appendScore = async (req, res) => {
  const id = req.params.id;
  const score = req.body.roll;
  try {
    let player = await getDocument(id);
    const { frames, gameOver } = player.body;
    const valid = validation(score, frames);
    if (valid && !gameOver) {
      const updatedPlayer = await addScore(score, player);
      await updateDocument(id, updatedPlayer);
      res.json(updatedPlayer);
    } else {
      res.status(400).send({ error: 'Game over' });
    }
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(400).send({ error: `player with id: [${id}] doesn\'t exist` });
    } else {
      res.status(400).send({ error: err.message });
    }
  }
};

module.exports = {
  getPlayers,
  getPlayer,
  deletePlayer,
  createPlayer,
  appendScore
};
