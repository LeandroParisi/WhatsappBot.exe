import Container from "typedi"
import PendingOrdersRepository from "../../../../../Services/SessionManagement/Repositories/PendingOrdersRepository";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository"
import CustomerTemplateMessagesFactory from "../../../../MessageFactories/CustomerTemplateMessagesFactory";
import { StepNumbers } from "../../../Steps/Interfaces/IStep";
import StepInfo from "../../../Steps/Messages/StepInfo";
import ClosingStep from "../../../Steps/StepsDefinition/9_ClosingStep/ClosingStep";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler"
import CheckCustomerOrdersDTO from "./DTO/CheckCustomerOrdersDTO"

export default class CheckCustomerOrdersAction implements IActionHandler<CheckCustomerOrdersDTO> {
  
  actionName = ActionsEnum.CHECK_CUSTOMER_ORDERS;

  async DispatchAction(payload: CheckCustomerOrdersDTO): Promise<StepInfo> {
    const taonRepository = Container.get(TaonRepository)
    const pendingOrdersRepository = Container.get(PendingOrdersRepository)

    const orders = await taonRepository.CheckCustomerOrders(payload)

    for (const order of orders) {
      pendingOrdersRepository.Upsert(order)
    }

    return new StepInfo(
      [
        `${CustomerTemplateMessagesFactory.GeneratePendingOrdersMessage(orders)}`,
        ClosingStep.INTRO_MESSAGE
      ],
      StepNumbers.closingStep,
    )
  }
}