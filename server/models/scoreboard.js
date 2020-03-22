const mongoose = require('mongoose');

// SCHEMA

const Schema = mongoose.Schema;
const ScoreboardSchema = new Schema({
    body: Object,
    date: {
        type: String,
        default: Date.now()
    }
})

// Model

const Scoreboard = mongoose.model('Scoreboard', ScoreboardSchema);

module.exports = Scoreboard;

