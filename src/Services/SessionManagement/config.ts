import Datastore = require("nedb-promises");
import DatabaseFactory from "../Shared/DatabaseFactory"
const errorHandler = require('../Shared/errorHandler')

class SessionDataDbs {
  customerDb : Datastore
  orderDb : Datastore
  addressesDb : Datastore
  pendingOrders : Datastore

  constructor() {
    this.customerDb = DatabaseFactory.Create("sessionManagement/customersData.db")
    this.orderDb = DatabaseFactory.Create("sessionManagement/ordersData.db")
    this.addressesDb = DatabaseFactory.Create("sessionManagement/addressesData.db")
    this.pendingOrders = DatabaseFactory.Create("sessionManagement/pendingOrders.db")

    this.customerDb.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error)
    })

    this.orderDb.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error)
    })

    this.addressesDb.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error)
    })

    this.pendingOrders.on('__error__', (datastore, event, error) => {
      errorHandler(datastore, event, error)
    })
  }
} 

export default new SessionDataDbs()