const router = require('express').Router();


const db = require('../db/connection');
const users = db.get('users');

router.get('/register', (req, res) => {
  res.send('Welcome to the Register route!')
});

router.get('/login', (req, res) => {
  res.send('Welcome to the Login route!')
});

module.exports = router;
