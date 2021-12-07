const Datastore = require('nedb-promises');
const errorHandler = require('../Shared/errorHandler');

const sessionData = Datastore.create('./src/data/userData/sessionData.db');

sessionData.on('__error__', (datastore, event, error) => {
  errorHandler(datastore, event, error);
});


const userData = Datastore.create('./src/data/userData/userData.db');

userData.on('__error__', (datastore, event, error) => {
  errorHandler(datastore, event, error);
});

module.exports = {
  sessionData,
  userData
};
