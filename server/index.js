const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
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

app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', routes);


app.listen(PORT, () => {
    
    console.log(`running om port: ${PORT}`);

});
