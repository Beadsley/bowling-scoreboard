const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ScoreboardSchema = new Schema({
    body: Object,
    date: {
        type: String,
        default: Date.now()
    }
})

const Scoreboard = mongoose.model('Scoreboard', ScoreboardSchema);

module.exports = Scoreboard;

