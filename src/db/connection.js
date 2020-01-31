const monk = require('monk');

let db = null;
function getDB() {
  if (db) {
    console.log('already connected to db...');
    return new Promise((resolve) => resolve(db));
  }
  console.log('trying to connect to db...');
  return monk(process.env.DB_URL, { useUnifiedTopology: true })
    .then(connection => {
      console.log('connected to db!');
      db = connection;
      return connection;
    }).catch(error => {
      console.log('Error connecting to DB');
      console.log(error);
    })
}

module.exports = getDB;
