
import Datastore = require("nedb-promises");
import { Service } from "typedi"
import Config from "../../config"
const errorHandler = require('../Shared/errorHandler')

@Service()
class LocationsDb {
  countriesDb : Datastore
  statesDb : Datastore
  citiesDb : Datastore

  constructor() {
    this.countriesDb = Datastore.create(`./${Config.dbsPath}/branchData/countriesData.db`)
    this.statesDb = Datastore.create(`./${Config.dbsPath}/branchData/statesData.db`)
    this.citiesDb = Datastore.create(`./${Config.dbsPath}/branchData/citiesData.db`)


    this.countriesDb.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error)
    })

    this.statesDb.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error)
    })

    this.citiesDb.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error)
    })
  }
} 

export default LocationsDb