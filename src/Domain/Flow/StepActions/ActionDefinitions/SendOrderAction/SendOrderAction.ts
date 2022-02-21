import Container from "typedi"
import Customer from "../../../../../../data/Models/Customer"
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository"
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler"
import Order from "../../../../../../data/Models/Order"

export default class SendOrderAction implements IActionHandler<Order> {
  
  actionName = ActionsEnum.SEND_ORDER;

  async DispatchAction(payload: Order, client: Customer): Promise<void> {
    const taonRepository = Container.get(TaonRepository)

    throw new Error("Method not implemented.")
  }
}