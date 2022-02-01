import Container, { Service } from "typedi";
import Customer from "../../../../../../data/Models/Customer";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";
import Order from "../../../../../../data/Models/Order";
import CustomerAddress, { CustomerAddressSQL } from "../../../../../../data/Models/CustomerAddress";

export default class SaveAddressAction implements IActionHandler<CustomerAddress> {
  
  actionName = ActionsEnum.SAVE_ADDRESS;

  async DispatchAction(payload: CustomerAddress): Promise<void> {
    console.log({ payload })
    const taonRepository = Container.get(TaonRepository);

    await taonRepository.SaveAddress(new CustomerAddressSQL(payload))

  }
}