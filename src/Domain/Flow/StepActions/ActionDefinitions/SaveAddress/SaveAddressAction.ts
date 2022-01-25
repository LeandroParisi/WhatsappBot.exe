import Container, { Service } from "typedi";
import Customer from "../../../../Models/Customer";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";
import Order from "../../../../Models/Order";
import CustomerAddress, { CustomerAddressSQL } from "../../../../Models/CustomerAddress";

export default class SaveAddressAction implements IActionHandler<CustomerAddress> {
  
  actionName = ActionsEnum.SAVE_ADDRESS;

  async DispatchAction(payload: CustomerAddress): Promise<void> {
    console.log({ payload })
    const taonRepository = Container.get(TaonRepository);

    await taonRepository.SaveAddress(new CustomerAddressSQL(payload))

  }
}