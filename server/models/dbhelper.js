const Scoreboard = require('./scoreboard');


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
    removeAll
}
