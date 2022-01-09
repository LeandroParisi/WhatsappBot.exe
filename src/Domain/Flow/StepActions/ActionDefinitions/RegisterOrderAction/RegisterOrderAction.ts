import Container, { Service } from "typedi";
import { OrderStatusEnum } from "../../../../../data/Interfaces/IOrderInfo";
import OrderRepository from "../../../../../Services/SessionManagement/OrderRepository";
import Customer from "../../../../Models/Customer";
import Order from "../../../../Models/Order";
import { RegisterOrderDTO } from "./RegisterOrderDTO";
import IActionHandler from "../../Interfaces/IActionHandler";


export default class RegisterOrderAction implements IActionHandler<RegisterOrderDTO> {

  /**
   *
   */
  constructor(private readonly repository : OrderRepository) {
    
  }

  public static async DispatchAction(payload: RegisterOrderDTO, customer: Customer): Promise<void> {
    const orderRepository = Container.get(OrderRepository);

    const order = new Order(
      customer.info.id,
      payload.promotionId,
      OrderStatusEnum.REGISTERED
    )

   await this.orderRepository.Insert(order);
  }
}