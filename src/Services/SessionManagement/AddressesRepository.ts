import Datastore = require("nedb-promises");
import { Service } from "typedi";
import IOrderInfo from "../../../data/Interfaces/IOrderInfo";
import Customer from "../../Domain/Models/Customer";
import CustomerAddress from "../../Domain/Models/CustomerAddress";
import Order from "../../Domain/Models/Order";
import SessionDataDbs from './config'

@Service()
export default class AddressesRepository {
  addressesDb : Datastore

  constructor() {
    this.addressesDb = SessionDataDbs.addressesDb;
  }

  async Upsert(address: CustomerAddress) : Promise<Number> {
    const affectedRows = await this.addressesDb.update(
      { customerId: address.customerId },
      { $set: address },
      { upsert: true}
    )
    return affectedRows
  }

  async GetClienAddresses(customerId : string) : Promise<CustomerAddress> {
    const address = await this.addressesDb.findOne({ customerId })
    return address as CustomerAddress;
  }

}

