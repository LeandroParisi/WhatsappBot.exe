import { Message } from "venom-bot";
import Customer from "../../../Models/Customer"
import Order from "../../../Models/Order";
import { SessionData } from "../../Startup/BotStartUp";
import StepInfo from "../Messages/StepInfo";

export interface ValidateParameters {
  answer: string, 
  sessionData? : SessionData, 
  customer? : Customer,
}

export default interface IValidateStep {
  ValidateAnswer(params: ValidateParameters) : boolean
}