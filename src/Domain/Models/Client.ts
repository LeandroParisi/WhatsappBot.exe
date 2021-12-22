import { Message } from "venom-bot"
import DaysUtils from "../../Shared/Utils/DaysUtils"

export default class Client {
  public fullName : string
  public shortName : string
  public _id : string
  public currentStep : number
  public lastMessage : Date

  constructor (message: Message) {
    this.fullName = message.sender.name
    this.shortName = message.sender.shortName
    this._id = message.from
    this.currentStep = 1
    this.lastMessage = DaysUtils.GetDateFromTimestamp(message.timestamp)
  }

}