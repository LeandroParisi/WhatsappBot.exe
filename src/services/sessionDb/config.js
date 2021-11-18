const Datastore = require('nedb');

const db = new Datastore({ filename: './services/sessionDb/database/botMemory.db', autoload: true });

module.exports = db;
