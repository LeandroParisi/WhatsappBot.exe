import Customer from "../../../../Data/Models/Customer"
import { SessionData } from "../../Startup/BotCore"

export interface ValidateParameters {
  answer: string, 
  sessionData? : SessionData, 
  customer? : Customer,
}

export default interface IValidateStep<T> {
  ValidateAnswer(params: ValidateParameters) : T
}