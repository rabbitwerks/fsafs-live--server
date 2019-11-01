const router = require('express').Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const db = require('../db/connection');
const users = db.get('users');

const registerSchema = Joi.object().keys({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  userClass: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  email: Joi.string().email({ minDomainSegments: 2 })
});

const loginSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
});

function responseError(res, next, statusCode) {
  res.status(statusCode);
  const error = new Error('Unable able to process request');
  next(error);
}

function createToken_sendResponse(res, next, user) {
  jwt.sign(
    { _id : user._id },
    process.env.TOKEN_SECRET,
    { expiresIn: '1d' },
    (err, token) => {
      if (err) {
        next(err);
      } else {
        res.json({ user, token });
      }
    }
  )
}


router.get('/register', (req, res) => {
  res.send('Welcome to the Register route!')
});

router.post('/register', (req, res, next) => {
  const result = registerSchema.validate(req.body);
  if(!result.error) {
    users.findOne({
      username: req.body.username,
    }).then(user => {
      if(user !== null) {
        console.log('Username already exists, please choose another...');
        const error = new Error('Username already exists, please choose another...');
        next(error);
      } else {
        bcrypt.hash(req.body.password.trim(), saltRounds)
          .then(hashedPassword => {
            const newUser = {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              username: req.body.username,
              userClass: req.body.userClass,
              email: req.body.email,
              password: hashedPassword
            };
            users.insert(newUser)
              .then(addedUser => {
                const user = {
                  _id: addedUser._id,
                  username: addedUser.username,
                  userClass: addedUser.userClass,
                }
                createToken_sendResponse(res, next, user)
              })
              .catch(error => next(error))
          })
          .catch(error => next(error));
      }
    })
  } else {
    res.json(result.error);
  }
})

router.get('/login', (req, res) => {
  res.send('Welcome to the Login route!')
});

router.post('/login', (req, res, next) => {
  const result = loginSchema.validate(req.body);
  if(!result.error) {
    users.findOne({
      username: req.body.username,
    })
    .then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password)
          .then(result => {
            if (result === true) {
              const payload = {
                _id: user._id,
                username: user.username,
                userClass: user.userClass,
              };
              delete user.password;
              createToken_sendResponse(res, next, payload)

            } else {
              responseError(res, next, 422);
            }
          })
      } else {
        responseError(res, next, 422);
      }
    })
  } else {
    responseError(res, next, 422);
  }
});

module.exports = router;
