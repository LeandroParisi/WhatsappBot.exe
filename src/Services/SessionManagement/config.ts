import Datastore = require("nedb-promises");
import Config from "../../config"
const errorHandler = require('../Shared/errorHandler')

class SessionDataDbs {
  customerDb : Datastore
  orderDb : Datastore
  addressesDb : Datastore
  pendingOrders : Datastore

  constructor() {
    this.customerDb = Datastore.create(`./${Config.dbsPath}/sessionManagement/customersData.db`)
    this.orderDb = Datastore.create(`./${Config.dbsPath}/sessionManagement/ordersData.db`)
    this.addressesDb = Datastore.create(`./${Config.dbsPath}/sessionManagement/addressesData.db`)
    this.pendingOrders = Datastore.create(`./${Config.dbsPath}/sessionManagement/pendingOrders.db`)

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