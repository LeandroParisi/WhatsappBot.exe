import Container from "typedi"
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler"
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository"
import StepInfo from "../../../Steps/Messages/StepInfo"
import EnrichOrderStep from "../../../Steps/StepsDefinition/3.2_EnrichOrderStep/EnrichOrderStep"
import { SessionData } from "../../../Startup/BotCore"
import ActionsUtils from "../../../Utils/ActionsUtils"
import ValidateCoupomDTO from "../ValidateCoupomAction/DTO/ValidateCoupomDTO"
import Order, { OrderSQL } from "../../../../../Data/Models/Order"
import Customer from "../../../../../Data/Models/Customer"
import { CurrentlyRegisteringOrder } from "../../../../../Data/Enums/CurrentlyRegisteringOrder"


export default class CalculateFaresAction implements IActionHandler<Order> {
  actionName = ActionsEnum.CALCULATE_FARES;
  
  async DispatchAction(payload: Order, customer: Customer, sessionData : SessionData): Promise<StepInfo> {
    console.log('CALCULATE FARES ACTION')
    const taonRepository = Container.get(TaonRepository)

    const orderSQL = new OrderSQL(payload)

    const calculatedFares = await taonRepository.CalculateFares(orderSQL)

    payload.UpdateFares(calculatedFares)

    if (payload.coupomId) {
      payload.currentlyRegistering = CurrentlyRegisteringOrder.COUPOM

      return new StepInfo (
        [
          "As taxas foram calculadas com sucesso.",
          "Agora vamos revalidar seu cupom."
        ],
        undefined,
        [ActionsEnum.UPDATE_ORDER, ActionsEnum.VALIDATE_COUPOM],
        [payload, new ValidateCoupomDTO(payload, payload.coupomCode)]
      )
    }


    payload.GetNextOrderRegisteringStep()

    const nextStep = EnrichOrderStep.ExtractMissingOrderInfo(payload, sessionData, customer)

    return new StepInfo(
      [
        "As taxas foram calculadas com sucesso.",
        ...nextStep.outboundMessages
      ],
      nextStep.nextStep,
      [ActionsEnum.UPDATE_ORDER ,...ActionsUtils.ExtractActions(nextStep)],
      [payload, ...ActionsUtils.ExtractActionsPayload(nextStep)]
    )
  }

}