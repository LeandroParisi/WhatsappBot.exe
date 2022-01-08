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
    this.ExtractMissingOrderInfo(orderInfo, branchData)
    throw new Error();
    // const invalidInformations = this.ExtractMissingOrderInfo(orderInfo)
  }
  
  private static ExtractMissingOrderInfo(
    orderInfo: Order,
    branchData : BranchData
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
    } else if (!orderInfo.address) {
      return new StepInfo(
        [
          "Precisamos preencher alguns dados de seu pedido.",
          "Favor digitar o número do endereço de entrega:",
          branchData.templateMessages.paymentMethods,
          "Ou, se quiser a entrega em outro endereço digite *cadastrar*."
        ],
        StepNumbers.selectPaymentMethod
      )
    } else {
      return new StepInfo(
        [
          "Todos os dados foram coletados corretamente!",
          "Agora vamos finalizar seu pedido",
          "Favor aguarde um instante"
        ],
        StepNumbers.closingStep,
        ActionsEnum.SEND_ORDER,
        Order
      )
    }
  }
}