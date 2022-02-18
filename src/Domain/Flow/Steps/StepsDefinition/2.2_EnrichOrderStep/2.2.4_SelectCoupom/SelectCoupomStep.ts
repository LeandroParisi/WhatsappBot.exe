import Container from "typedi"
import { CurrentlyRegisteringOrder } from "../../../../../../../data/Models/Order"
import TaonRepository from "../../../../../../Services/TaonBackend/TaonRepository"
import staticImplements from "../../../../../../Shared/Anotations/staticImplements"
import GenericParser from "../../../../../../Shared/Parsers/GenericParser"
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
    super(stepDefinitionArgs);
    this.ORDER_STEP = SelectCoupomStep.ORDER_STEP
    this.ADDRESS_STEP = SelectCoupomStep.ADDRESS_STEP
  }

  public async Interact() : Promise<StepInfo> {
    const isCoupomSelected = this.ValidateAnswer()

    if (isCoupomSelected) {
      return await this.VerifyCoupom()
    } else {
      this.OrderInfo.currentlyRegistering = CurrentlyRegisteringOrder.COMMENTS

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

  private async VerifyCoupom(): Promise<StepInfo> {
    const taonRepository = Container.get(TaonRepository)
    const { isValid, id } = await taonRepository.VerifyCoupomValidity(this.formattedAnswer, this.SessionData.branchData.id)


    if (isValid) {
      this.OrderInfo.coupomId = id
      this.OrderInfo.currentlyRegistering = CurrentlyRegisteringOrder.COMMENTS

      const nextStep = EnrichOrderStep.ExtractMissingOrderInfo(this.OrderInfo, this.SessionData, this.Customer)
      return new StepInfo(
        [
          'Perfeito! Este cupom é válido para esta compra.',
          ...nextStep.outboundMessages
        ],
        nextStep.nextStep,
        [ActionsEnum.UPDATE_ORDER, ...ActionsUtils.ExtractActions(nextStep)],
        [this.OrderInfo, ...ActionsUtils.ExtractActionsPayload(nextStep)]
      )
    } else {
      return new StepInfo(
        [
          'Desculpe, Este cupom NÃO é válido para esta compra.',
          'Se quiser tentar aplicar outro cupom basta digitar o nome.',
          `Caso contrário digite *${SelectCoupomStep.NEGATION}* para não aplicar nenhum cupom`
        ],
        StepNumbers.selectCoupom,
      )
    }
  }

  private ValidateAnswer() : boolean {
    if (GenericParser.ToLowerTrim(this.Answer) === SelectCoupomStep.NEGATION) return false
    this.formattedAnswer = GenericParser.ToUpperTrim(this.Answer)
    return true
  }
}