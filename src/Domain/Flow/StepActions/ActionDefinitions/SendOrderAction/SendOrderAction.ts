import Container from "typedi"
import Customer from "../../../../../Data/Models/Customer"
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository"
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler"
import Order, { OrderSQL } from "../../../../../Data/Models/Order"
import OrderRepository from "../../../../../Services/SessionManagement/Repositories/OrderRepository"
import StepInfo from "../../../Steps/Messages/StepInfo"
import { StepNumbers } from "../../../Steps/Interfaces/IStep"
import CustomerRepository from "../../../../../Services/SessionManagement/Repositories/CustomerRepository"

export default class SendOrderAction implements IActionHandler<Order> {
  
  actionName = ActionsEnum.SEND_ORDER;

  async DispatchAction(payload: Order, customer: Customer): Promise<StepInfo> {
    console.log('SendOrderAction')

    const taonRepository = Container.get(TaonRepository)
    const orderRepository = Container.get(OrderRepository)
    const customerRepository = Container.get(CustomerRepository)


    const orderSql = new OrderSQL(payload)

    try {
      await taonRepository.RegisterOrder(orderSql)
      await orderRepository.DeleteOrderById(payload._id)

      customer.hasOrders = true
      await customerRepository.UpdateClient(customer._id, customer)
      return new StepInfo(
        [
          "Seu pedido foi devidamente registrado.",
          "Para acompanhar seu pedido basta."
        ],
        StepNumbers.welcomeStep
      )

    } catch(error) {
      console.log(error)
    } 
  }
}