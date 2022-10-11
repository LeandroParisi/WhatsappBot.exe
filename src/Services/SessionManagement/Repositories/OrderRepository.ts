import Datastore from "nedb-promises"
import { Service } from "typedi"
import Order, { CreateOrder } from "../../../Data/Models/Order"
import SessionDataDbs from '../config'

@Service()
export default class OrderRepository {
  orderDb : Datastore

  constructor() {
    this.orderDb = SessionDataDbs.orderDb
  }

  async Insert(order: Order) : Promise<Order> {
    const insertedOrder = await this.orderDb.insert(order)
    return insertedOrder
  }

  async GetClientOrders(customerId : string) : Promise<Order> {
    const order = await this.orderDb.findOne({ customerId })

    return CreateOrder(order as Order)
  }

  async UpdateOrder(order : Order) : Promise<number> {
    const affectedRows = await this.orderDb.update({ _id: order._id }, { $set: order })
    return affectedRows
  }

  async CleanUp() : Promise<void> {
    await this.orderDb.remove({}, { multi: true })
  }

  async DeleteOrderById(_id : string) : Promise<void> {
    await this.orderDb.remove({ _id }, { multi: true })
  }
}

