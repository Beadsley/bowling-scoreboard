const Scoreboard = require('./scoreboard');
const mongodb = require('mongodb');

const getDocument = (id) => {
  return new Promise((resolve, reject) => {
    Scoreboard.findById(id, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getDocuments = () => {
  return new Promise((resolve, reject) => {
    Scoreboard.find({}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const insertDocument = (name) => {
  return new Promise((resolve, reject) => {
    const data = {
      body: {
        name: name,
        scores: [],
        consecutiveScores: [],
        scoreboardScores: [],
        spare: false,
        strikeTotal: 0,
        frames: 1,
        gameOver: false,
        totalScore: 0,
      },
    };
    const scoreboard = new Scoreboard(data);

    scoreboard.save((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const updateDocument = (id, obj) => {
  return new Promise((resolve, reject) => {
    const myquery = { _id: new mongodb.ObjectID(id) };

    Scoreboard.updateOne(myquery, { $set: obj }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
const removeAll = () => {
  return new Promise((resolve, reject) => {
    Scoreboard.deleteMany({}, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
};

const removeDocument = (id) => {
  return new Promise((resolve, reject) => {
    const myquery = { _id: new mongodb.ObjectID(id) };
    Scoreboard.deleteOne(myquery, (err, result) => {
      if (!err) {
        resolve(result);
        console.log(`Removed ${id}`);
      } else {
        reject(err);
      }
    });
  });
};

module.exports = {
  getDocument,
  getDocuments,
  insertDocument,
  updateDocument,
  removeAll,
  removeDocument,
};
