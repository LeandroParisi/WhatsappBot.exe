import { Message } from "venom-bot"
import staticImplements from "../../../../../../Shared/Anotations/staticImplements"
import Customer from "../../../../../Models/Customer"
import Order from "../../../../../Models/Order"
import { SessionData } from "../../../../Startup/BotStartUp"
import { ActionsEnum } from "../../../../StepActions/Interfaces/IActionHandler"
import Validations from "../../../../Utils/Validations"
import IStep, { StepInteractionPayload, StepNumbers } from "../../../Interfaces/IStep"
import IValidatedStep, { ValidateParameters } from "../../../Interfaces/IValidatedStep"
import StepInfo from "../../../Messages/StepInfo"
import EnrichOrderStep from "../EnrichOrderStep"


@staticImplements<IStep>()
@staticImplements<IValidatedStep<boolean>>()
export default class SelectPaymentMethodStep {
  static STEP_NUMBER = StepNumbers.selectPaymentMethod
  
  static Interact({
    customer,
    message,
    sessionData,
    orderInfo,
    } : StepInteractionPayload
    ) : StepInfo {
    const { branchData } = sessionData
    const answer = message.body

    const isValidAnswer = this.ValidateAnswer(
      { answer, sessionData }
    )

    if (isValidAnswer) {
      orderInfo.paymentMethodId = branchData
        .paymentMethods[Number(answer) -  1].id

      const nextStep = EnrichOrderStep.ExtractMissingOrderInfo(orderInfo, branchData, customer)

      return new StepInfo(
        nextStep.outboundMessages,
        nextStep.nextStep,
        ActionsEnum.UPDATE_ORDER,
        orderInfo
      )
    } else {
      return new StepInfo(
        [
          "Desculpe, a opção que você selecionou é inválida",
          "Vamos tentar novamente.",
          "Favor digitar o número do tipo de entrega que prefere:",
          branchData.templateMessages.paymentMethods,
        ],
        StepNumbers.selectPaymentMethod
      )
    }
  }

  static ValidateAnswer(
    {
      answer,
      sessionData,
    } : ValidateParameters
  ) : boolean {
    const { branchData } = sessionData
    if (Validations.IsInRange(answer, branchData.paymentMethods)) {
      return true
    }
    return false
  }
}