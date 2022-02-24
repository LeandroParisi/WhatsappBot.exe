import Container from "typedi"
import Customer from "../../../../../../data/Models/Customer"
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository"
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler"

export default class CheckCustomerOrdersAction implements IActionHandler<Customer> {
  
  actionName = ActionsEnum.CHECK_CUSTOMER_ORDERS;

  async DispatchAction(payload: Customer): Promise<void> {
    const taonRepository = Container.get(TaonRepository)

    console.log("CHECK_CUSTOMER_ORDERS_ACTION")
    console.log({payload})


    throw new Error("Method not implemented.")
  }
}