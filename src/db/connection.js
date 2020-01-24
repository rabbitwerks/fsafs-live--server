const monk = require('monk');

const local = 'localhost:27017/fsafs-live';
const remote = 'mongodb+srv://rabbitwerks:<gax4-ic!-y4J2Hp>@userdb-ghjre.gcp.mongodb.net/test?retryWrites=true&w=majority';

const db = monk(remote, { useUnifiedTopology: true });

module.exports = db;
