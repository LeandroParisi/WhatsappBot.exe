import Datastore from "nedb-promises"
import { Service } from "typedi"
import { OrderSQL } from "../../../Data/Models/Order"
import SessionDataDbs from '../config'

@Service()
export default class PendingOrdersRepository {
  private pendingOrdersDb : Datastore

  constructor() {
    this.pendingOrdersDb = SessionDataDbs.pendingOrders
  }

  async Upsert(order: OrderSQL) : Promise<number> {
    const registeredAddress = await this.pendingOrdersDb.findOne({ id: order.id })
    let insertedRows = 1

    if (registeredAddress) {
      insertedRows = await this.pendingOrdersDb.update(
        { id: order.id },
        { $set: order },
        { upsert: true }
      )
    } else {
      await this.pendingOrdersDb.insert(order)
    }

    return insertedRows
  }

  async CleanUp() : Promise<void> {
    await this.pendingOrdersDb.remove({}, { multi: true })
  }
}