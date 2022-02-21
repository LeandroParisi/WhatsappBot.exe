import { Message } from "venom-bot"
import CustomerInfo from "../DTOs/CustomerInfo"
import CustomerTemplateMessages from "../DTOs/CustomerTemplateMessages"
import DaysUtils from "../../src/Shared/Utils/DaysUtils"
import { v4 as uuid } from "uuid"

export default class Customer {
  public _id : string
  public currentStep : number
  public lastMessage : Date
  public info? : CustomerInfo
  public customerTemplateMessages? : CustomerTemplateMessages

  constructor (message: Message) {
    this._id = uuid()
    this.currentStep = 1
    this.lastMessage = DaysUtils.GetDateFromTimestamp(message.timestamp)
  }
}