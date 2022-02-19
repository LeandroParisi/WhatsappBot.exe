import Container from "typedi";
import OrderRepository from "../../../../../Services/SessionManagement/Repositories/OrderRepository";
import Customer from "../../../../../../data/Models/Customer";
import Order, { OrderSQL } from "../../../../../../data/Models/Order";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository";
import IStep, { StepNumbers } from "../../../Steps/Interfaces/IStep";
import StepInfo from "../../../Steps/Messages/StepInfo";
import ConfirmOrderStep from "../../../Steps/StepsDefinition/8_ConfirmOrder/ConfirmOrder";
import BranchData from "../../../../../../data/DTOs/BranchData";
import EnrichOrderStep from "../../../Steps/StepsDefinition/2.2_EnrichOrderStep/EnrichOrderStep";
import { SessionData } from "../../../Startup/BotCore";
import ActionsUtils from "../../../Utils/ActionsUtils";


export default class CalculateFaresAction implements IActionHandler<Order> {
  actionName = ActionsEnum.CALCULATE_FARES;
  
  async DispatchAction(payload: Order, customer: Customer, sessionData : SessionData): Promise<StepInfo> {
    console.log('calculate fares action')
    const taonRepository = Container.get(TaonRepository);
    const orderRepository = Container.get(OrderRepository);

    console.log({payload})

    const orderSQL = new OrderSQL(payload)

    const calculatedFares = await taonRepository.CalculateFares(orderSQL)

    // const updatedOrder = orderSQL.MapToMongo()

    console.log({updatedOrderBeforeCopy: payload})

    payload.UpdateFares(calculatedFares)

    console.log({updatedOrderAfterCopy: payload})

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