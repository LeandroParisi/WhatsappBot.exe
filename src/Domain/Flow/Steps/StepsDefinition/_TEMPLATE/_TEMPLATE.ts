import { Message } from "venom-bot"
import staticImplements from "../../../../../Shared/Anotations/staticImplements"
import Customer from "../../../../Models/Customer"
import Order from "../../../../Models/Order"
import { SessionData } from "../../../Startup/BotStartUp"
import IStep, { StepNumbers } from "../../Interfaces/IStep"
import IValidatedStep, { ValidateParameters } from "../../Interfaces/IValidatedStep"
import StepInfo from "../../Messages/StepInfo"



@staticImplements<IStep>()
@staticImplements<IValidatedStep<boolean>>()
export default class _TEMPLATE {
  static STEP_NUMBER = StepNumbers.selectPaymentMethod
  
  static Interact(
    customer: Customer,
    message : Message,
    sessionData : SessionData,
    orderInfo : Order
    ) : StepInfo {
      throw new Error()
  }

  static ValidateAnswer(
    {
      answer,
      sessionData,
    } : ValidateParameters
  ) : boolean {
    throw new Error()
  }
}