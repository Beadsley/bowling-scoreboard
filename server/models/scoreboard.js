const mongoose = require('mongoose');

// SCHEMA

const Schema = mongoose.Schema;
const ScoreboardSchema = new Schema({
    title: String,
    body: Object,
    date: {
        type: String,
        default: Date.now()
    }
})

// Model

const Scoreboard = mongoose.model('Scoreboard', ScoreboardSchema);

module.exports = Scoreboard;

// save data to db

// const data = {
//     title: "test",
//     body: {
//         name: 'dan',
//         scoresAray: [],
//         consecutiveScoresArray: [],
//         spare: false,
//         strikeTotal: 0,
//         frames: 1,
//         gameOver: false,
//         totalScore: 0
//     }

// }

// const scoreboard = new Scoreboard(data);

// scoreboard.save((error) => {
//     if (error) {
//         console.log(`Error: ${error.message}`);

//     } else {
//         console.log('data saved');

//     }
// })

