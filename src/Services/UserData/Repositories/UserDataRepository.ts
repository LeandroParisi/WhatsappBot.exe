import Datastore = require("nedb-promises");
import { Service } from "typedi"
import LoginData from "../../../Data/Interfaces/LoginData"
import BranchDataDb from '../branchDataConfig'

@Service()
export default class UserDataRepository {
  sessionData : Datastore


  constructor() {
    this.sessionData = BranchDataDb.sessionData
  }

  async SaveLoginData(data : LoginData) : Promise<string> {
    await this.DestroySessionData()
    const insertedData = await this.sessionData.insert(data)
    return insertedData._id
  }

  async DestroySessionData() {
    await this.sessionData.remove({}, { multi: true })
  }

  async GetLoginData() : Promise<LoginData> {
    const data = await this.sessionData.findOne({})
    return data
  }

  async UpdateUserData(query : any, payload: { lastStartup: Date; }) {
    await this.sessionData.update(query, { $set: payload })
  }
}

