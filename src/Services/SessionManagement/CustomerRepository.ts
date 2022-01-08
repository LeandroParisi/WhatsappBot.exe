import Datastore = require("nedb-promises");
import { Service } from "typedi";
import Customer from "../../Domain/Models/Customer";
import SessionDataDbs from './config'

@Service()
export default class CustomerRepository {
  customerDb : Datastore

  constructor() {
    this.customerDb = SessionDataDbs.customerDb;
  }

  async GetClientById(clientId: string) : Promise<Customer> {
    const document = await this.customerDb.findOne({ _id: clientId });
    return document as Customer
  }

  async InsertCustomer(client: Customer) : Promise<Customer> {
    const insertedClient = await this.customerDb.insert(client)
    return insertedClient;
  }

  async UpdateClient(client : Customer, payload : any) : Promise<number> {
    const affectedRows = await this.customerDb.update({ _id: client._id }, { $set: payload })
    return affectedRows
  }

  async FindAll(query : Object) : Promise<Array<Customer>> {
    const clients = await this.customerDb.find(query)
    return clients as Array<Customer>
  }

  async DeleteClient(query : Object) : Promise<any> {
    const affectedRows = await this.customerDb.remove(query, { multi: true })
    return affectedRows
  }
}

