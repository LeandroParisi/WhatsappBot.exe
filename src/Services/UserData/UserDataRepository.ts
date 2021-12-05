import Datastore = require("nedb-promises");
import { Service } from "typedi";
import Client from "../../Domain/Models/Client";
import api from "../TaonBackend/services/api";
import LoginData from "../../Domain/Models/LoginData";

const db = require('./config');

@Service()
export default class UserDataRepository {
  db : Datastore

  constructor() {
    this.db = db;
  }

  async SaveLoginData(data : LoginData) : Promise<void> {
    await this.db.insert(data);
  }

  async GetLoginData() : Promise<LoginData> {
    const data = await this.db.findOne({});
    return data;
  }
}

