
import Datastore = require("nedb-promises");
import { Service } from "typedi"
import DatabaseFactory from "../Shared/DatabaseFactory"
const errorHandler = require('../Shared/errorHandler')

@Service()
class LocationsDb {
  countriesDb : Datastore
  statesDb : Datastore
  citiesDb : Datastore

  constructor() {
    this.countriesDb = DatabaseFactory.Create("branchData/countriesData.db")
    this.statesDb = DatabaseFactory.Create("branchData/statesData.db")
    this.citiesDb = DatabaseFactory.Create("branchData/citiesData.db")


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