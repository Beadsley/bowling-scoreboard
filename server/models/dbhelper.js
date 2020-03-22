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

module.exports = {
    getDocument,
}
