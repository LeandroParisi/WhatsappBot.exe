import Container from "typedi"
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler"
import OrderRepository from "../../../../../Services/SessionManagement/Repositories/OrderRepository"
import Order from "../../../../../Data/Models/Order"

export default class UpdateOrderAction implements IActionHandler<Order> {
  actionName = ActionsEnum.UPDATE_ORDER;

  async DispatchAction(payload: Order): Promise<void> {
    const orderRepository = Container.get(OrderRepository)
    console.log("UPDATE ORDER")

    await orderRepository.UpdateOrder(payload)
  }
}