import Datastore = require("nedb-promises");
import { Service } from "typedi";
import Client from "../../Domain/Models/Client";

const db = require('./config');

@Service()
export default class SessionRepository {
  db : Datastore

  constructor() {
    this.db = db;
  }

  async GetClientById(clientId: string) : Promise<Client> {
    const document = await this.db.findOne({ _id: clientId });
    return document as Client
  }

  async InsertClient(client: Client) : Promise<Client> {
    const insertedClient = await this.db.insert(client)
    return insertedClient;
  }

  async UpdateClient(client : Client, payload : any) : Promise<number> {
    const affectedRows = await this.db.update({ _id: client._id }, { $set: payload })
    return affectedRows
  }
}

