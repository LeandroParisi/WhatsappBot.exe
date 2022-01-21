import { Message } from "venom-bot"
import staticImplements from "../../../../../../Shared/Anotations/staticImplements"
import Customer from "../../../../../Models/Customer"
import Order from "../../../../../Models/Order"
import { SessionData } from "../../../../Startup/BotStartUp"
import { ActionsEnum } from "../../../../StepActions/Interfaces/IActionHandler"
import ActionsUtils from "../../../../Utils/ActionsUtils"
import Validations from "../../../../Utils/Validations"
import IStep, { StepInteractionPayload, StepNumbers } from "../../../Interfaces/IStep"
import IValidatedStep, { ValidateParameters } from "../../../Interfaces/IValidatedStep"
import StepInfo from "../../../Messages/StepInfo"
import EnrichOrderStep from "../EnrichOrderStep"


@staticImplements<IStep>()
@staticImplements<IValidatedStep<boolean>>()
export default class SelectDeliveryTypeStep {
  static STEP_NUMBER = StepNumbers.selectDeliveryType
  
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
        orderInfo.deliveryTypeId = branchData
          .deliveryTypes[Number(answer) -  1].id

        const nextStep = EnrichOrderStep.ExtractMissingOrderInfo(orderInfo, branchData, customer)

        return new StepInfo(
          nextStep.outboundMessages,
          nextStep.nextStep,
          [ActionsEnum.UPDATE_ORDER, ...ActionsUtils.ExtractActions(nextStep)],
          [orderInfo, ...ActionsUtils.ExtractActionsPayload(nextStep)]
        )
      } else {
        return new StepInfo(
          [
            "Desculpe, a opção que você selecionou é inválida",
            "Vamos tentar novamente.",
            "Favor digitar o número do tipo de entrega que prefere:",
            branchData.templateMessages.deliveryTypes,
          ],
          StepNumbers.selectDeliveryType
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
    if (Validations.IsInRange(answer, branchData.deliveryTypes)) {
      return true
    }
    return false
  }
}