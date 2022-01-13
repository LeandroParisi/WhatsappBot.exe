import Container, { Service } from "typedi";
import Customer from "../../../../Models/Customer";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";
import OrderDTO from "../../DTOs/OrderDTO";
import OrderRepository from "../../../../../Services/SessionManagement/OrderRepository";

export default class UpdateOrderAction implements IActionHandler<OrderDTO> {
  actionName = ActionsEnum.UPDATE_ORDER;

  async DispatchAction(payload: OrderDTO): Promise<void> {
    const orderRepository = Container.get(OrderRepository);

    await orderRepository.UpdateOrder(payload)
  }
}