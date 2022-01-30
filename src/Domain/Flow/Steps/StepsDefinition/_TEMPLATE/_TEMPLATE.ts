import { Message } from "venom-bot"
import staticImplements from "../../../../../Shared/Anotations/staticImplements"
import Customer from "../../../../Models/Customer"
import Order from "../../../../Models/Order"
import { SessionData } from "../../../Startup/BotCore"
import IStep, { StepDefinitionArgs, StepNumbers } from "../../Interfaces/IStep"
import IValidatedStep, { ValidateParameters } from "../../Interfaces/IValidatedStep"
import StepInfo from "../../Messages/StepInfo"



@staticImplements<IStep>()
@staticImplements<IValidatedStep<boolean>>()
export default class _TEMPLATE {
  static STEP_NUMBER = StepNumbers.selectPaymentMethod
  
  static Interact({
    customer,
    message,
    sessionData,
    orderInfo
    } : StepDefinitionArgs
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