import Container from "typedi"

import ValidateCoupomBody from "../../../../../../Services/TaonBackend/Requests/ValidateCoupomBody"

import TaonRepository from "../../../../../../Services/TaonBackend/TaonRepository"
import staticImplements from "../../../../../../Shared/Anotations/staticImplements"
import GenericParser from "../../../../../../Shared/Parsers/GenericParser"
import ValidateCoupomDTO from "../../../../StepActions/DTOs/ValidateCoupomDTO"
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

  private async VerifyCoupom(): Promise<StepInfo> {
    const taonRepository = Container.get(TaonRepository)
    const body : ValidateCoupomBody = { distanceInKm: this.OrderInfo.distanceInKm, subTotal: this.OrderInfo.subTotal} 
    const { 
      isValid, id, validationMessages, freeDelivery
    } = await taonRepository.VerifyCoupomValidity(this.formattedAnswer, this.SessionData.branchData.id, body)


    if (isValid) {
      this.OrderInfo.coupomId = id
      this.OrderInfo.GetNextOrderRegisteringStep()

      // this.OrderInfo.currentlyRegistering = GetNextOrderRegisteringStep(this.OrderInfo.currentlyRegistering)
      this.OrderInfo.freeDelivery = freeDelivery

      if (freeDelivery) {
        this.OrderInfo.totalPrice -= this.OrderInfo.deliveryFee
        this.OrderInfo.deliveryFee = 0
      } 

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
    } else if (!isValid && !!validationMessages?.length) {
      return new StepInfo(
        [
          'Desculpe, este cupom não é valido para esta compra pelos seguinte motivos:',
          ...validationMessages,
          'Se quiser tentar aplicar outro cupom basta digitar o nome.',
          `Caso contrário digite *${SelectCoupomStep.NEGATION}* para não aplicar nenhum cupom`
        ],
        StepNumbers.selectCoupom,
      )
    }
    else {
      return new StepInfo(
        [
          'Desculpe, este cupom não existe.',
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