import { Message } from "venom-bot"
import CustomerInfo from "../../data/Interfaces/CustomerInfo"
import DaysUtils from "../../Shared/Utils/DaysUtils"

export default class Customer {
  public _id : string
  public currentStep : number
  public lastMessage : Date
  public info? : CustomerInfo

  constructor (message: Message) {
    this._id = message.from
    this.currentStep = 1
    this.lastMessage = DaysUtils.GetDateFromTimestamp(message.timestamp)
  }

}