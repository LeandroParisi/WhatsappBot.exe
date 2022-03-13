import Container from "typedi"
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler"
import AddressesRepository from "../../../../../Services/SessionManagement/Repositories/AddressesRepository"
import CustomerAddress from "../../../../../Data/Models/CustomerAddress"

export default class UpdateAddressAction implements IActionHandler<CustomerAddress> {
  actionName = ActionsEnum.UPSERT_ADDRESS;
  
  async DispatchAction(payload: CustomerAddress): Promise<void> {
    
    const Repository = Container.get(AddressesRepository)
    console.log("UPDATE ADDRESS")
    await Repository.Upsert(payload)
  }
}