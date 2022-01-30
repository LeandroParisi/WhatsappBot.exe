
import Datastore = require("nedb-promises");
const errorHandler = require('../Shared/errorHandler');

class BranchDataDb {
  sessionData : Datastore

  constructor() {
    this.sessionData = Datastore.create('./data/dbs/branchData/sessionData.db');


    this.sessionData.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error);
    });
  }
} 

export default new BranchDataDb()