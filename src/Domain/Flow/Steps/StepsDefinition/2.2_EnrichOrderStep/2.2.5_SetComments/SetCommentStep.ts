import { CurrentlyRegisteringOrder } from "../../../../../../../data/Models/Order"
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
export default class SetCommentStep extends StepDefinition implements IOptionsAnswer {
  static STEP_NUMBER = StepNumbers.setComment
  static ADDRESS_STEP = false
  static ORDER_STEP = true
  static NEGATION = "n/a"
  static INTRO_MESSAGES = [`Caso deseje adicionar algum comentário ao seu pedido basta digitar abaixo, ou, se preferir digite *${SetCommentStep.NEGATION}* para não deixar nenhum comentário`]

  formattedAnswer: string | number

  /**
   *
   */
   constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs);
    this.ORDER_STEP = SetCommentStep.ORDER_STEP
    this.ADDRESS_STEP = SetCommentStep.ADDRESS_STEP
  }

  public async Interact() : Promise<StepInfo> {
    const hasComment = this.ValidateAnswer()

    this.OrderInfo.currentlyRegistering = CurrentlyRegisteringOrder.DELIVERY_FEE

    if (hasComment) {
      this.OrderInfo.comments = this.formattedAnswer as string

      const nextStep = await EnrichOrderStep.ExtractMissingOrderInfo(this.OrderInfo, this.SessionData, this.Customer)
      return new StepInfo(
        [
          'Perfeito! Seu comentário foi adicionado no pedido.',
          ...nextStep.outboundMessages
        ],
        nextStep.nextStep,
        [ActionsEnum.UPDATE_ORDER, ...ActionsUtils.ExtractActions(nextStep)],
        [this.OrderInfo, ...ActionsUtils.ExtractActionsPayload(nextStep)]
      )
    }

    const nextStep = await EnrichOrderStep.ExtractMissingOrderInfo(this.OrderInfo, this.SessionData, this.Customer)
    return new StepInfo(
      [
        'Perfeito! Seu pedido será feito sem nenhum comentário',
        ...nextStep.outboundMessages
      ],
      nextStep.nextStep,
      [ActionsEnum.UPDATE_ORDER, ...ActionsUtils.ExtractActions(nextStep)],
      [this.OrderInfo, ...ActionsUtils.ExtractActionsPayload(nextStep)]
    )
  }

  private ValidateAnswer() : boolean {
    if (GenericParser.ToLowerTrim(this.Answer) === SetCommentStep.NEGATION) return false
    this.formattedAnswer = this.Answer.trim()
    return true
  }
}