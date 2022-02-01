import { Message } from "venom-bot";
import Customer from "../../../../../data/Models/Customer"
import Order from "../../../../../data/Models/Order";
import { SessionData } from "../../Startup/BotCore";
import StepInfo from "../Messages/StepInfo";

export interface ValidateParameters {
  answer: string, 
  sessionData? : SessionData, 
  customer? : Customer,
}

export default interface IValidateStep<T> {
  ValidateAnswer(params: ValidateParameters) : T
}