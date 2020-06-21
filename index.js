const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const routes = require('./server/routes/endpoints.js');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/scoreboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('mongoose connected');
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', routes);
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`running om port: ${PORT}`);
});
