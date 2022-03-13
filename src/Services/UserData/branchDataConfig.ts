
import Datastore = require("nedb-promises");
import Config from "../../config"
const errorHandler = require('../Shared/errorHandler')

class BranchDataDb {
  sessionData : Datastore

  constructor() {
    this.sessionData = Datastore.create(`./${Config.dbsPath}/branchData/sessionData.db`)

    this.sessionData.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error)
    })
  }
} 

export default new BranchDataDb()