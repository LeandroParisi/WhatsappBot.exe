import staticImplements from "../../../../../../Shared/Anotations/staticImplements"
import { ActionsEnum } from "../../../../StepActions/Interfaces/IActionHandler"
import ActionsUtils from "../../../../Utils/ActionsUtils"
import Validations from "../../../../Utils/Validations"
import IStep, {  IStepOptions, StepNumbers } from "../../../Interfaces/IStep"
import StepDefinition, { StepDefinitionArgs } from "../../../Interfaces/StepDefinition"
import StepInfo from "../../../Messages/StepInfo"
import EnrichOrderStep from "../EnrichOrderStep"


@staticImplements<IStep>()
@staticImplements<IStepOptions>()
export default class SelectDeliveryTypeStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.selectDeliveryType
  static ORDER_STEP = true
  static ADDRESS_STEP = false
  
  /**
    *
  */
    constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs);
    this.ORDER_STEP = SelectDeliveryTypeStep.ORDER_STEP
    this.ADDRESS_STEP = SelectDeliveryTypeStep.ADDRESS_STEP
  }
  
  public async Interact() : Promise<StepInfo> {
      const { branchData } = this.SessionData

      const isValidAnswer = this.ValidateAnswer()

      if (isValidAnswer) {
        this.OrderInfo.deliveryTypeId = branchData
          .deliveryTypes[Number(this.Answer) -  1].id

        const nextStep = EnrichOrderStep.ExtractMissingOrderInfo(this.OrderInfo, this.SessionData, this.Customer)

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