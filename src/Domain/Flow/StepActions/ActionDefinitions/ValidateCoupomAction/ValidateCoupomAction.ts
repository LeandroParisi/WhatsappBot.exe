import Container from "typedi"
import Customer from "../../../../../../data/Models/Customer"
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository"
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler"
import StepInfo from "../../../Steps/Messages/StepInfo"
import ValidateCoupomDTO from "../../DTOs/ValidateCoupomDTO"
import { SessionData } from "../../../Startup/BotCore"
import ValidateCoupomBody from "../../../../../Services/TaonBackend/Requests/ValidateCoupomBody"
import EnrichOrderStep from "../../../Steps/StepsDefinition/3.2_EnrichOrderStep/EnrichOrderStep"
import ActionsUtils from "../../../Utils/ActionsUtils"
import SelectCoupomStep from "../../../Steps/StepsDefinition/3.2_EnrichOrderStep/3.2.5_SelectCoupom/SelectCoupomStep"
import { StepNumbers } from "../../../Steps/Interfaces/IStep"

export default class ValidateCoupomAction implements IActionHandler<ValidateCoupomDTO> {
  
  actionName = ActionsEnum.VALIDATE_COUPOM;

  async DispatchAction(payload: ValidateCoupomDTO, customer : Customer, sessionData : SessionData) 
  : Promise<StepInfo> {
    console.log('VALIDATE COUPOM ACTION')
    const { order, coupomCode } = payload
    const { distanceInKm, subTotal } = order

    const taonRepository = Container.get(TaonRepository)
    const body : ValidateCoupomBody = { distanceInKm, subTotal } 
    const { 
      isValid, id, validationMessages, freeDelivery
    } = await taonRepository.VerifyCoupomValidity(coupomCode, sessionData.branchData.id, body)


    if (isValid) {
      order.coupomId = id
      order.coupomCode = coupomCode
      order.GetNextOrderRegisteringStep()

      order.freeDelivery = freeDelivery

      if (freeDelivery) {
        order.totalPrice -= order.deliveryFee
        order.deliveryFee = 0
      } 

      const nextStep = EnrichOrderStep.ExtractMissingOrderInfo(order, sessionData, customer)
      return new StepInfo(
        [
          'Perfeito! Este cupom é válido para esta compra.',
          ...nextStep.outboundMessages
        ],
        nextStep.nextStep,
        [ActionsEnum.UPDATE_ORDER, ...ActionsUtils.ExtractActions(nextStep)],
        [order, ...ActionsUtils.ExtractActionsPayload(nextStep)]
      )
    } else if (!isValid && !!validationMessages?.length) {
      order.coupomId = undefined
      order.coupomCode = undefined
      order.freeDelivery = undefined

      return new StepInfo(
        [
          'Desculpe, este cupom não é valido para esta compra pelos seguinte motivos:',
          ...validationMessages,
          'Se quiser tentar aplicar outro cupom basta digitar o nome.',
          `Caso contrário digite *${SelectCoupomStep.NEGATION}* para não aplicar nenhum cupom`
        ],
        StepNumbers.selectCoupom,
        [ActionsEnum.UPDATE_ORDER],
        [order]
      )
    }
    else {
      order.coupomId = undefined
      order.coupomCode = undefined
      order.freeDelivery = undefined

      return new StepInfo(
        [
          'Desculpe, este cupom não existe.',
          'Se quiser tentar aplicar outro cupom basta digitar o nome.',
          `Caso contrário digite *${SelectCoupomStep.NEGATION}* para não aplicar nenhum cupom`
        ],
        StepNumbers.selectCoupom,
        [ActionsEnum.UPDATE_ORDER],
        [order]
      )
    }
  }
}