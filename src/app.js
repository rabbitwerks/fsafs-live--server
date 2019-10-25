const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');

const auth = require('./auth');

const port = 1337;

require('dotenv').config();

const app = express();

app.use(cors())

app.use(volleyball);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Fullstack Auth from Scratch backend!');
})

app.use('/auth', auth);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not found: ' + req.originalUrl);
  next(error)
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  })
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started listening on port ${port}!`))
