import Container, { Service } from "typedi";
import { OrderStatusEnum } from "../../../../../../data/Interfaces/IOrderInfo";
import OrderRepository from "../../../../../Services/SessionManagement/OrderRepository";
import Customer from "../../../../Models/Customer";
import Order from "../../../../Models/Order";
import { RegisterOrderDTO } from "./RegisterOrderDTO";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";


export default class RegisterOrderAction implements IActionHandler<RegisterOrderDTO> {
  actionName = ActionsEnum.REGISTER_ORDER;
  
  async DispatchAction(payload: RegisterOrderDTO, customer: Customer): Promise<void> {
    const orderRepository = Container.get(OrderRepository);

    const order = new Order(
      customer._id,
      payload.branchId,
      payload.promotionId,
      OrderStatusEnum.REGISTERED
    )

   await orderRepository.Insert(order);
  }
}