const jwt = require('jsonwebtoken');

const db = require('../db/connection.js');
const users = db.get('users');



function isLoggedIn(req, res, next) {
  if(!req.cookies.token) {
    console.log('Cookie not sent');
    return
  }
  jwt.verify(req.cookies.token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      const error = new Error(err);
      req.user = null;
      next(error);
    } else {
      users.findOne({'_id': decoded._id })
        .then(user => {
          if (user) {
            // TODO: clear out sensitive props
            req.user = {
              _id: user._id,
              firstName: user.firstName,
              username: user.username,
              userClass: user.userClass
            };
          } else {
            req.user = null;
          }
          return next();
        })
    }
  })
}

module.exports = {
  isLoggedIn,
}
