import Datastore = require("nedb-promises");
const errorHandler = require('../Shared/errorHandler')

class SessionDataDbs {
  customerDb : Datastore
  orderDb : Datastore
  addressesDb : Datastore
  pendingOrders : Datastore

  constructor() {
    this.customerDb = Datastore.create('./data/dbs/sessionManagement/customersData.db')
    this.orderDb = Datastore.create('./data/dbs/sessionManagement/ordersData.db')
    this.addressesDb = Datastore.create('./data/dbs/sessionManagement/addressesData.db')
    this.pendingOrders = Datastore.create('./data/dbs/sessionManagement/pendingOrders.db')

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