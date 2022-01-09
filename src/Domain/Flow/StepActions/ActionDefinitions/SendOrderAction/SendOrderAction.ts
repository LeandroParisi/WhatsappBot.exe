import Container, { Service } from "typedi";
import Customer from "../../../../Models/Customer";
import { RegisterOrderDTO } from "../RegisterOrderAction/RegisterOrderDTO";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";

export default class SendOrderAction implements IActionHandler<RegisterOrderDTO> {
  
  actionName = ActionsEnum.SEND_ORDER;

  async DispatchAction(payload: RegisterOrderDTO, client: Customer): Promise<void> {
    const taonRepository = Container.get(TaonRepository);

    throw new Error("Method not implemented.");
  }
}