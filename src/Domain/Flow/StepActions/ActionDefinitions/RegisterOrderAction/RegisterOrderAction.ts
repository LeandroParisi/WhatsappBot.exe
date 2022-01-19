import Container, { Service } from "typedi";
import { OrderStatusEnum } from "../../../../../../data/Interfaces/IOrderInfo";
import OrderRepository from "../../../../../Services/SessionManagement/OrderRepository";
import Customer from "../../../../Models/Customer";
import Order from "../../../../Models/Order";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";


export default class RegisterOrderAction implements IActionHandler<Order> {
  actionName = ActionsEnum.REGISTER_ORDER;
  
  async DispatchAction(payload: Order, customer: Customer): Promise<void> {
    const orderRepository = Container.get(OrderRepository);

    const order = new Order(
      customer._id,
      payload.branchId,
      payload.promotionId,
      OrderStatusEnum.REGISTERING
    )

   await orderRepository.Insert(order);
  }
}