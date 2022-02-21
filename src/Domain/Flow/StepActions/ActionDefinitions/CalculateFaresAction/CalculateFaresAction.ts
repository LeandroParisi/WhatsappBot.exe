import Container from "typedi"
import OrderRepository from "../../../../../Services/SessionManagement/Repositories/OrderRepository"
import Customer from "../../../../../../data/Models/Customer"
import Order, { OrderSQL } from "../../../../../../data/Models/Order"
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler"
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository"
import StepInfo from "../../../Steps/Messages/StepInfo"
import EnrichOrderStep from "../../../Steps/StepsDefinition/3.2_EnrichOrderStep/EnrichOrderStep"
import { SessionData } from "../../../Startup/BotCore"
import ActionsUtils from "../../../Utils/ActionsUtils"


export default class CalculateFaresAction implements IActionHandler<Order> {
  actionName = ActionsEnum.CALCULATE_FARES;
  
  async DispatchAction(payload: Order, customer: Customer, sessionData : SessionData): Promise<StepInfo> {
    console.log('CALCULATE FARES ACTION')
    const taonRepository = Container.get(TaonRepository)
    const orderRepository = Container.get(OrderRepository)

    const orderSQL = new OrderSQL(payload)

    const calculatedFares = await taonRepository.CalculateFares(orderSQL)

    payload.UpdateFares(calculatedFares)

    await orderRepository.UpdateOrder(payload)

    const nextStep = EnrichOrderStep.ExtractMissingOrderInfo(payload, sessionData, customer)

    return new StepInfo(
      [
        "As taxas foram calculadas com sucesso.",
        ...nextStep.outboundMessages
      ],
      nextStep.nextStep,
      [...ActionsUtils.ExtractActions(nextStep)],
      [...ActionsUtils.ExtractActionsPayload(nextStep)]
    )
  }
}