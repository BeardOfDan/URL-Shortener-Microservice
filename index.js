const express = require('express');
const app = express();

const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

app.get('/', (req, res, next) => {
  res.send('url shortener microservice');
});

app.get('/new/:url', (req, res, next) => {
  res.send('make a new short url')
});

app.get('/:url', (req, res, next) => {
  res.send('redirect to associated url');
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
