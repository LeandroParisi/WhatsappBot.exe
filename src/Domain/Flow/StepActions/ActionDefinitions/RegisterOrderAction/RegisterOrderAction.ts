import Container from "typedi";
import OrderRepository from "../../../../../Services/SessionManagement/Repositories/OrderRepository";
import Customer from "../../../../../../data/Models/Customer";
import Order from "../../../../../../data/Models/Order";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";


export default class RegisterOrderAction implements IActionHandler<Order> {
  actionName = ActionsEnum.REGISTER_ORDER;
  
  async DispatchAction(payload: Order, customer: Customer): Promise<void> {
    const orderRepository = Container.get(OrderRepository);

    const order = new Order(
      customer._id,
      payload.branchId,
      payload.promotionId,
    )

   await orderRepository.Insert(order);
  }
}