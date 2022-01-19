import Container, { Service } from "typedi";
import Customer from "../../../../Models/Customer";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";
import Order from "../../../../Models/Order";

export default class _TEMPLATE implements IActionHandler<Order> {
  
  actionName = ActionsEnum.SEND_ORDER;

  async DispatchAction(payload: Order, client: Customer): Promise<void> {
    const taonRepository = Container.get(TaonRepository);

    throw new Error("Method not implemented.");
  }
}