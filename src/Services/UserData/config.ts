
import Datastore = require("nedb-promises");
const errorHandler = require('../Shared/errorHandler');

class BranchDataDb {
  sessionData : Datastore
  branchData : Datastore

  constructor() {
    this.sessionData = Datastore.create('./src/data/dbs/branchData/sessionData.db');

    this.sessionData.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error);
    });

    this.branchData = Datastore.create('./src/data/dbs/branchData/branchData.db');

    this.branchData.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error);
    });
  }
} 

export default new BranchDataDb()