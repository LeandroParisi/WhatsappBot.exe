import { Service } from "typedi";
import Client from "../../Domain/Models/Client";
import ISessionDb from "./Interfaces/ISessionDb";

const db = require('./config');

@Service()
export default class SessionRepository {
  db : ISessionDb<Client>

  constructor() {
    this.db = db;
  }

  async GetClientCurrentStep(clientId) {
    await this.db.insert({ _id: clientId });

    const client = await this.db.findOne({ _id: clientId });
    if (client) {
      return { hasOpenedSession: true, currentSession: client.currentStep };
    }

    this.db.insert({ _id: clientId, currentStep: 1 });
    return { hasOpenedSession: true, currentSession: 1 };
  }
}

