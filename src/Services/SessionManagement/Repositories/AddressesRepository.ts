import Datastore = require("nedb-promises");
import { Service } from "typedi";
import IOrderInfo from "../../../../data/Interfaces/IOrderInfo";
import Customer from "../../../../data/Models/Customer";
import CustomerAddress from "../../../../data/Models/CustomerAddress";
import Order from "../../../../data/Models/Order";
import SessionDataDbs from '../config'

@Service()
export default class AddressesRepository {
  addressesDb : Datastore

  constructor() {
    this.addressesDb = SessionDataDbs.addressesDb;
  }

  async Upsert(address: CustomerAddress) : Promise<Number> {
    const registeredAddress = await this.addressesDb.findOne({ _id: address._id })
    let insertedRows = 1
    if (registeredAddress) {
      delete address._id
      insertedRows = await this.addressesDb.update(
        { customerId: address.customerId },
        { $set: address },
        { upsert: true }
      )
    } else {
      await this.addressesDb.insert(address)
    }

    return insertedRows
  }

  async GetClientAddresses(customerId : string) : Promise<CustomerAddress> {
    const address = await this.addressesDb.findOne({ customerId })
    return address as CustomerAddress;
  }

  async CleanUp() : Promise<void> {
    await this.addressesDb.remove({}, { multi: true })
  }
}

