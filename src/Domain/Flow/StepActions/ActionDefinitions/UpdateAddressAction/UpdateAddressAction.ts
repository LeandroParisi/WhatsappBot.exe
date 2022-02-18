import Container, { Service } from "typedi";
import Customer from "../../../../../../data/Models/Customer";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";
import OrderRepository from "../../../../../Services/SessionManagement/Repositories/OrderRepository";
import AddressesRepository from "../../../../../Services/SessionManagement/Repositories/AddressesRepository";
import CustomerAddress from "../../../../../../data/Models/CustomerAddress";

export default class UpdateAddressAction implements IActionHandler<CustomerAddress> {
  actionName = ActionsEnum.UPSERT_ADDRESS;
  
  async DispatchAction(payload: CustomerAddress): Promise<void> {
    
    const Repository = Container.get(AddressesRepository);
    console.log("UPDATE ADDRESS")
    await Repository.Upsert(payload)
  }
}