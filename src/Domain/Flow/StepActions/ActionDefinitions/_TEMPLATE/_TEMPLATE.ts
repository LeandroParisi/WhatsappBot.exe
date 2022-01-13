import Container, { Service } from "typedi";
import Customer from "../../../../Models/Customer";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";
import OrderDTO from "../../DTOs/OrderDTO";

export default class _TEMPLATE implements IActionHandler<OrderDTO> {
  
  actionName = ActionsEnum.SEND_ORDER;

  async DispatchAction(payload: OrderDTO, client: Customer): Promise<void> {
    const taonRepository = Container.get(TaonRepository);

    throw new Error("Method not implemented.");
  }
}