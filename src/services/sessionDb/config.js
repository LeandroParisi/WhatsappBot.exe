const Datastore = require('nedb-promises');
const errorHandler = require('./errorHandler');

const db = Datastore.create('./src/data/sessionDb/botMemory.db');

db.on('__error__', (datastore, event, error) => {
  errorHandler(datastore, event, error);
});

module.exports = db;
