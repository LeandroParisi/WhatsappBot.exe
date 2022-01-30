import staticImplements from "../../../../../../Shared/Anotations/staticImplements"
import { ActionsEnum } from "../../../../StepActions/Interfaces/IActionHandler"
import ActionsUtils from "../../../../Utils/ActionsUtils"
import Validations from "../../../../Utils/Validations"
import IStep, {  StepNumbers } from "../../../Interfaces/IStep"
import StepDefinition from "../../../Interfaces/StepDefinition"
import StepInfo from "../../../Messages/StepInfo"
import EnrichOrderStep from "../EnrichOrderStep"


@staticImplements<IStep>()
export default class SelectDeliveryTypeStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.selectDeliveryType
  
  public Interact() : StepInfo {
      const { branchData } = this.SessionData

      const isValidAnswer = this.ValidateAnswer()

      if (isValidAnswer) {
        this.OrderInfo.deliveryTypeId = branchData
          .deliveryTypes[Number(this.Answer) -  1].id

        const nextStep = EnrichOrderStep.ExtractMissingOrderInfo(this.OrderInfo, branchData, this.Customer)

        return new StepInfo(
          nextStep.outboundMessages,
          nextStep.nextStep,
          [ActionsEnum.UPDATE_ORDER, ...ActionsUtils.ExtractActions(nextStep)],
          [this.OrderInfo, ...ActionsUtils.ExtractActionsPayload(nextStep)]
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

  private ValidateAnswer() : boolean {
    const { branchData } = this.SessionData
    if (Validations.IsInRange(this.Answer, branchData.deliveryTypes)) {
      return true
    }
    return false
  }
}