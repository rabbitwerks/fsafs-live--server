const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true,
  optionsSuccessStatus: 200,
}

const auth = require('./auth');
const middlewares = require('./middlewares');
const api = require('./api');


const port = 1337;

require('dotenv').config();

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(volleyball);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Fullstack Auth from Scratch backend!');
})

app.use('/auth', auth);

app.use('/api', middlewares.isLoggedIn, api);

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
