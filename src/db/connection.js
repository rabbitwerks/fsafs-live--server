const monk = require('monk');

const local = 'localhost:27017/fsafs-live';

const db = monk(local, { useUnifiedTopology: true });

module.exports = db;
