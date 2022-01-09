import { Message } from "venom-bot";
import BranchData from "../../../../../data/Interfaces/BranchData";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../Models/Customer";
import IStep, { StepNumbers } from "../../Interfaces/IStep";
import MainMenu from "../10_MainMenu/MainMenu";
import StepInfo from "../../Messages/StepInfo";
import { SessionData } from "../../../Startup/BotStartUp";
import Order from "../../../../Models/Order";
import { ActionsEnum } from "../../../StepActions/Interfaces/IActionHandler";
import { AddressPossibleAnswers } from "./2.2.3_SelectAddress/SelectAddressStep";
import SelectAddress from "../StepGenerators/SelectAddress";

@staticImplements<IStep>()
export default class EnrichOrderStep {
  static STEP_NUMBER = StepNumbers.enrichOrderStep
  static STEP_NAME = "Verificar dados do usuário"
  
  static Interact(
    customer: Customer,
    message : Message,
    { branchData } : SessionData,
    orderInfo : Order
  ) : StepInfo {
    console.log({ address: customer.info.addresses })
    return this.ExtractMissingOrderInfo(orderInfo, branchData, customer)
  }
  
  public static ExtractMissingOrderInfo(
    orderInfo: Order,
    branchData : BranchData,
    customer : Customer
    ) : StepInfo {
    if (!orderInfo.deliveryTypeId) {
      return new StepInfo(
        [
          "Precisamos preencher alguns dados de seu pedido.",
          "Favor digitar o número do tipo de entrega que prefere:",
          branchData.templateMessages.deliveryTypes,
        ],
        StepNumbers.selectDeliveryType
      )
    } else if (!orderInfo.paymentMethodId) {
      return new StepInfo(
        [
          "Precisamos preencher alguns dados de seu pedido.",
          "Favor digitar o número do tipo de pagamento que prefere:",
          branchData.templateMessages.paymentMethods,
        ],
        StepNumbers.selectPaymentMethod
      )
    } else if (!orderInfo.addressId) {
      return SelectAddress.GenerateMessage({}, customer)
    } else {
      // TODO: Calll to action para iniciar o cadastro antes de entrar no proximo step
      return new StepInfo(
        [
          "Todos os dados foram coletados corretamente!",
          "Vamos só confirmar os dados do pedido, ok?"
        ],
        StepNumbers.confirmOrder,
        ActionsEnum.SEND_ORDER,
        Order
      )
    }
  }
}