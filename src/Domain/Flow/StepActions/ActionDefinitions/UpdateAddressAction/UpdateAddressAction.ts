import Container, { Service } from "typedi";
import Customer from "../../../../Models/Customer";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";
import OrderRepository from "../../../../../Services/SessionManagement/OrderRepository";
import AddressesRepository from "../../../../../Services/SessionManagement/AddressesRepository";
import CustomerAddress from "../../../../Models/CustomerAddress";

export default class UpdateAddressAction implements IActionHandler<CustomerAddress> {
  actionName = ActionsEnum.UPSERT_ADDRESS;
  
  async DispatchAction(payload: CustomerAddress): Promise<void> {
    const Repository = Container.get(AddressesRepository);
    console.log("UPDATE ADDRESS")
    await Repository.Upsert(payload)
  }
}