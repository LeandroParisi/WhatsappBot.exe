import Container, { Service } from "typedi";
import Customer from "../../../../../../data/Models/Customer";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";
import Order from "../../../../../../data/Models/Order";
import CustomerAddress, { CustomerAddressSQL } from "../../../../../../data/Models/CustomerAddress";
import CustomerRepository from "../../../../../Services/SessionManagement/Repositories/CustomerRepository";
import SessionHandler from "../../../../../Services/SessionManagement/Handlers/SessionHandler";

export default class SaveAddressAction implements IActionHandler<CustomerAddress> {
  
  actionName = ActionsEnum.SAVE_ADDRESS;

  async DispatchAction(payload: CustomerAddress): Promise<void> {
    const taonRepository = Container.get(TaonRepository);
    const customerRepository = Container.get(CustomerRepository);

    const customer = await customerRepository.GetCustomerById(payload.customerId)

    const newAddress = [...customer.info.customerAddresses, payload]

    await customerRepository.UpdateClient(
      customer._id, 
      { 
        "info.customerAddresses": newAddress, 
        customerTemplateMessages:  SessionHandler.GenerateTemplateMessages(newAddress)
      }
    )

    await taonRepository.SaveAddress(new CustomerAddressSQL(payload))

  }
}