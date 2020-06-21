const express = require('express');
const router = express.Router();
const {
  getPlayers,
  getPlayer,
  deletePlayer,
  createPlayer,
  appendScore,
} = require('../controllers/controller.scoreboard');

router.get('/players', getPlayers);

router.get('/player/:id', getPlayer);

router.delete('/player/:id', deletePlayer);

router.post('/player', createPlayer);

router.put('/player/score/:id', appendScore);

module.exports = router;
