

import staticImplements from "../../../../../../Shared/Anotations/staticImplements"
import GenericParser from "../../../../../../Shared/Parsers/GenericParser"
import ValidateCoupomDTO from "../../../../StepActions/ActionDefinitions/ValidateCoupomAction/DTO/ValidateCoupomDTO"
import { ActionsEnum } from "../../../../StepActions/Interfaces/IActionHandler"
import ActionsUtils from "../../../../Utils/ActionsUtils"
import IStep, { IIntroMessages, IOptionsAnswer, IStepOptions, StepNumbers } from "../../../Interfaces/IStep"
import StepDefinition, { StepDefinitionArgs } from "../../../Interfaces/StepDefinition"
import StepInfo from "../../../Messages/StepInfo"
import EnrichOrderStep from "../EnrichOrderStep"


@staticImplements<IStep>()
@staticImplements<IStepOptions>()
@staticImplements<IIntroMessages>()
export default class SelectCoupomStep extends StepDefinition implements IOptionsAnswer {
  static STEP_NUMBER = StepNumbers.selectCoupom
  static ORDER_STEP = true
  static ADDRESS_STEP = false

  static NEGATION = "n/a"
  static INTRO_MESSAGES = [
    `Favor digitar o nome do cupom desejado, ou, digitar *${SelectCoupomStep.NEGATION}* para não aplicar nenhum cupom`
  ]

  formattedAnswer : string


  /**
   *
   */
  constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs)
    this.ORDER_STEP = SelectCoupomStep.ORDER_STEP
    this.ADDRESS_STEP = SelectCoupomStep.ADDRESS_STEP
  }

  public async Interact() : Promise<StepInfo> {
    const isCoupomSelected = this.ValidateAnswer()

    if (isCoupomSelected) {
      return new StepInfo(
        [
          "Perfeito, favor aguardar enquanto valido este cupom.",
        ],
        undefined,
        [ActionsEnum.VALIDATE_COUPOM],
        [new ValidateCoupomDTO(this.OrderInfo, this.formattedAnswer)]
      )
    } else {
      this.OrderInfo.GetNextOrderRegisteringStep()

      // this.OrderInfo.currentlyRegistering = GetNextOrderRegisteringStep(this.OrderInfo.currentlyRegistering)

      const nextStep = await EnrichOrderStep.ExtractMissingOrderInfo(this.OrderInfo, this.SessionData, this.Customer)
      return new StepInfo(
        [
          'Perfeito! Vamos dar sequência ao pedido sem um cupom.',
          ...nextStep.outboundMessages
        ],
        nextStep.nextStep,
        [ActionsEnum.UPDATE_ORDER, ...ActionsUtils.ExtractActions(nextStep)],
        [this.OrderInfo, ...ActionsUtils.ExtractActionsPayload(nextStep)]
      )
    }
  }

  private ValidateAnswer() : boolean {
    if (GenericParser.ToLowerTrim(this.Answer) === SelectCoupomStep.NEGATION) return false
    this.formattedAnswer = GenericParser.ToUpperTrim(this.Answer)
    return true
  }
}