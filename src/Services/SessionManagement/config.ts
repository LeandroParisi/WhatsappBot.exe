import Datastore = require("nedb-promises");
const errorHandler = require('../Shared/errorHandler');

class SessionDataDbs {
  customerDb : Datastore
  orderDb : Datastore

  constructor() {
    this.customerDb = Datastore.create('./data/dbs/sessionManagement/customers.db');
    this.orderDb = Datastore.create('./data/dbs/sessionManagement/orders.db');

    this.customerDb.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error);
    });

    this.orderDb.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error);
    });
  }
} 

export default new SessionDataDbs()