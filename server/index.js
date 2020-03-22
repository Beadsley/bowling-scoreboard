const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080

const routes = require('./routes/api.js')


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/scoreboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log('mongoose connected');

})
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', routes);

if (process.env.ENV === 'production') {
    app.use(express.static('client/build'));
}
app.listen(PORT, () => {
    console.log(`running om port: ${PORT}`);
});
