const Scoreboard = require('./scoreboard');
const mongodb = require('mongodb');

const getDocument = (id) => {

    return new Promise((resolve, reject) => {

        Scoreboard.findById(id, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);

            }
        })
    })
};

const getDocuments = () => {

    return new Promise((resolve, reject) => {

        Scoreboard.find({}, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);

            }
        })
    })
};

const insertDocument = function (name) {

    return new Promise((resolve, reject) => {

        const data = {
            body: {
                name: name,
                scoresAray: [],
                consecutiveScoresArray: [],
                spare: false,
                strikeTotal: 0,
                frames: 1,
                gameOver: false,
                totalScore: 0
            }
        }

        const scoreboard = new Scoreboard(data);
        scoreboard.save((error, result) => {
            if (error) {
                reject(error)

            } else {
                resolve(result)

            }
        })
    })
};


const updateDocument = function (id, obj) {

    return new Promise((resolve, reject) => {

        const myquery = { _id: new mongodb.ObjectID(id) };

        Scoreboard.updateOne(myquery
            , { $set: obj }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
    })
};
const removeAll = function () {

    return new Promise((resolve, reject) => {

        Scoreboard.deleteMany({}, function (err, result) {
            if (!err) {
                console.log("Removed everything");
                resolve(result)
            } else {
                console.log(err);

                reject(err);
            }
        });
    })
};

module.exports = {
    getDocument,
    getDocuments,
    insertDocument,
    updateDocument,
    removeAll
}
