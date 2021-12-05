import { Message } from "venom-bot"

export default class Client {
  public fullName : string
  public shortName : string
  public _id : string
  public currentStep : number

  constructor (message: Message) {
    this.fullName = message.sender.name
    this.shortName = message.sender.shortName
    this._id = message.from
    this.currentStep = 1
  }

}