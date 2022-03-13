import { Message } from "venom-bot"
import CustomerInfo from "../DTOs/CustomerInfo"
import CustomerTemplateMessages from "../DTOs/CustomerTemplateMessages"
import { v4 as uuid } from "uuid"
import DaysUtils from "../../Shared/Utils/DaysUtils"

export default class Customer {
  public _id : string
  public currentStep : number
  public lastMessage : Date
  public hasOrders? : boolean
  public info? : CustomerInfo
  public customerTemplateMessages? : CustomerTemplateMessages

  constructor (message: Message) {
    this._id = uuid()
    this.currentStep = 1
    this.lastMessage = DaysUtils.GetDateFromTimestamp(message.timestamp)
  }
}