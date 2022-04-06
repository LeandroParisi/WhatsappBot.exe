
import Datastore = require("nedb-promises");
import DatabaseFactory from "../Shared/DatabaseFactory"
const errorHandler = require('../Shared/errorHandler')

class BranchDataDb {
  sessionData : Datastore

  constructor() {
    this.sessionData = DatabaseFactory.Create("branchData/sessionData.db")

    this.sessionData.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error)
    })
  }
} 

export default new BranchDataDb()