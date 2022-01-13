import { Message } from "venom-bot";
import BranchData from "../../../../../../data/Interfaces/BranchData";
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
import OrderDTO from "../../../StepActions/DTOs/OrderDTO";
import ConfirmOrder, { OrderConfirmationAnswers } from "../8_ConfirmOrder/ConfirmOrder";
import ConfirmOrderStep from "../8_ConfirmOrder/ConfirmOrder";

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
      return new StepInfo(
        [
          "Todos os dados foram coletados corretamente!",
          "Vamos só confirmar os dados do pedido, ok?",
          "Vou lhe enviar as informações de seu pedido, caso algumas delas estiver errada favor *digitar o número* da mesma para corrigirmos.",
          `Caso esteja tudo certo digite *${OrderConfirmationAnswers.OK}*`,
          ...ConfirmOrderStep.GenerateConfirmationMessage(orderInfo, branchData, customer)
        ],
        StepNumbers.confirmOrder,
      )
    }
  }
}