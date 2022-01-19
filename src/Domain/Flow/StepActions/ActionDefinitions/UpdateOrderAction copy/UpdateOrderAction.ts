import Container, { Service } from "typedi";
import Customer from "../../../../Models/Customer";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";
import OrderRepository from "../../../../../Services/SessionManagement/OrderRepository";
import Order from "../../../../Models/Order";

export default class UpdateOrderAction implements IActionHandler<Order> {
  actionName = ActionsEnum.UPDATE_ORDER;

  async DispatchAction(payload: Order): Promise<void> {
    const orderRepository = Container.get(OrderRepository);

    await orderRepository.UpdateOrder(payload)
  }
}