import Datastore = require("nedb-promises");
import { Service } from "typedi";
import IOrderInfo from "../../../data/Interfaces/IOrderInfo";
import Customer from "../../Domain/Models/Customer";
import Order from "../../Domain/Models/Order";
import SessionDataDbs from './config'

@Service()
export default class OrderRepository {
  orderDb : Datastore

  constructor() {
    this.orderDb = SessionDataDbs.orderDb;
  }

  async Insert(order: Order) : Promise<Order> {
    const insertedOrder = await this.orderDb.insert(order)
    return insertedOrder;
  }

  async GetClientOrders(customerId : string) : Promise<Order> {
    const order = await this.orderDb.findOne({ customerId })
    return order as Order;
  }

  async UpdateOrder(order : IOrderInfo) : Promise<number> {
    const affectedRows = await this.orderDb.update({ _id: order._id }, { $set: order })
    return affectedRows
  }

  async CleanUp() : Promise<void> {
    await this.orderDb.remove({}, { multi: true })
  }
}

