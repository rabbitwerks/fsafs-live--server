const jwt = require('jsonwebtoken');

const getDB = require('../db/connection.js');



function isLoggedIn(req, res, next) {
  if(!req.cookies.token) {
    console.log('Cookie not sent');
    return next();
  }
  jwt.verify(req.cookies.token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      const error = new Error(err);
      req.user = null;
      next(error);
    } else {
      const db = await getDB();
      const users = db.get('users');
      users.findOne({'_id': decoded._id })
        .then(user => {
          if (user) { 
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
