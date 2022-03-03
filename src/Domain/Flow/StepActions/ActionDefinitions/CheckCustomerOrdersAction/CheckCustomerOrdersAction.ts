import Container from "typedi"
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository"
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler"
import CheckCustomerOrdersDTO from "./DTO/CheckCustomerOrdersDTO"

export default class CheckCustomerOrdersAction implements IActionHandler<CheckCustomerOrdersDTO> {
  
  actionName = ActionsEnum.CHECK_CUSTOMER_ORDERS;

  async DispatchAction(payload: CheckCustomerOrdersDTO): Promise<void> {
    console.log("CHECK_CUSTOMER_ORDERS_ACTION")
    const taonRepository = Container.get(TaonRepository)

    const orders = await taonRepository.CheckCustomerOrders(payload)

    console.log({orders})

    throw new Error("Method not implemented.")
  }
}