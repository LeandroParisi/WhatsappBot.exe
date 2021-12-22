const Datastore = require('nedb-promises');
const errorHandler = require('../Shared/errorHandler');

const db = Datastore.create('./src/data/dbs/sessionManagement/sessionManagement.db');

db.on('__error__', (datastore, event, error) => {
  errorHandler(datastore, event, error);
});

module.exports = db;
