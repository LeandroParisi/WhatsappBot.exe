import Container from "typedi";
import OrderRepository from "../../../../../Services/SessionManagement/Repositories/OrderRepository";
import Customer from "../../../../../../data/Models/Customer";
import Order, { CurrentlyRegisteringOrder, OrderSQL } from "../../../../../../data/Models/Order";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository";
import IStep, { StepNumbers } from "../../../Steps/Interfaces/IStep";
import StepInfo from "../../../Steps/Messages/StepInfo";
import ConfirmOrderStep from "../../../Steps/StepsDefinition/8_ConfirmOrder/ConfirmOrder";
import BranchData from "../../../../../../data/DTOs/BranchData";


export default class CalculateFaresAction implements IActionHandler<Order> {
  actionName = ActionsEnum.CALCULATE_FARES;
  
  async DispatchAction(payload: Order, customer: Customer, branchData : BranchData): Promise<StepInfo> {
    console.log('calculate ares action')
    const taonRepository = Container.get(TaonRepository);
    const orderRepository = Container.get(OrderRepository);

    const orderSQL = new OrderSQL(payload)

    const {
      deliveryFee,
      estimatedDeliveryDuration,
      subTotal,
      totalPrice
    } = await taonRepository.CalculateFares(orderSQL)

    const updatedOrder = orderSQL.MapToMongo()

    updatedOrder.deliveryFee = deliveryFee
    updatedOrder.estimatedDeliveryDuration = estimatedDeliveryDuration
    updatedOrder.subTotal = subTotal
    updatedOrder.totalPrice = totalPrice
    updatedOrder.currentlyRegistering = CurrentlyRegisteringOrder.FINISHED

    await orderRepository.UpdateOrder(updatedOrder)

    return new StepInfo(
      [
        "As taxas foram calculadas com sucesso.",
        ...ConfirmOrderStep.GenerateConfirmationMessage(updatedOrder, branchData, customer)
      ],
      StepNumbers.confirmOrder

    )
  }
}