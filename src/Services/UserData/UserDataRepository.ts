import Datastore = require("nedb-promises");
import { Service } from "typedi";
import Client from "../../Domain/Models/Client";
import { api } from "../TaonBackend/services/api";
import LoginData from "../../data/Interfaces/LoginData";
import BranchData from "../../data/Interfaces/BranchData";
import BranchDataDb from './config'

@Service()
export default class UserDataRepository {
  sessionData : Datastore
  branchData : Datastore

  constructor() {
    this.sessionData = BranchDataDb.sessionData;
    this.branchData = BranchDataDb.branchData;
  }

  async SaveLoginData(data : LoginData) : Promise<string> {
    const insertedData = await this.sessionData.insert(data);
    return insertedData._id
  }

  async DestroySessionData() {
    await this.sessionData.remove({}, { multi: true });
  }

  async DestroyUserData() {
    await this.branchData.remove({}, { multi: true });
  }

  async GetLoginData() : Promise<LoginData> {
    const data = await this.sessionData.findOne({});
    return data;
  }

  async SaveUserData(branchData : BranchData) : Promise<any> {
    await this.DestroyUserData();
    await this.branchData.insert(branchData);
  }

  async UpdateUserData(query : any, payload: { lastStartup: Date; }) {
    await this.sessionData.update(query, { $set: payload })
  }
}

