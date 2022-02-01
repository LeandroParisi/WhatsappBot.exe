import { Message } from "venom-bot";
import BranchData from "../../../../../../data/DTOs/BranchData";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../../../data/Models/Customer";
import IStep, { StepNumbers } from "../../Interfaces/IStep";
import MainMenu from "../10_MainMenu/MainMenu";
import StepInfo from "../../Messages/StepInfo";
import { SessionData } from "../../../Startup/BotCore";
import Order from "../../../../../../data/Models/Order";
import { ActionsEnum } from "../../../StepActions/Interfaces/IActionHandler";
import SelectAddress from "../StepGenerators/SelectAddress";
import StepDefinition from "../../Interfaces/StepDefinition";
import ConfirmOrderStep, { OrderConfirmationAnswers } from "../8_ConfirmOrder/ConfirmOrder";

@staticImplements<IStep>()
export default class EnrichOrderStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.enrichOrderStep
  
  public async Interact() : Promise<StepInfo> {
    return EnrichOrderStep.ExtractMissingOrderInfo(this.OrderInfo, this.SessionData, this.Customer)
  }
  
  public static ExtractMissingOrderInfo(
    orderInfo: Order,
    sessionData : SessionData,
    customer : Customer
    ) : StepInfo {
    if (!orderInfo.deliveryTypeId) {
      return new StepInfo(
        [
          "Precisamos preencher alguns dados de seu pedido.",
          "Favor digitar o número do tipo de entrega que prefere:",
          sessionData.branchData.templateMessages.deliveryTypes,
        ],
        StepNumbers.selectDeliveryType
      )
    } else if (!orderInfo.paymentMethodId) {
      return new StepInfo(
        [
          "Precisamos preencher alguns dados de seu pedido.",
          "Favor digitar o número do tipo de pagamento que prefere:",
          sessionData.branchData.templateMessages.paymentMethods,
        ],
        StepNumbers.selectPaymentMethod
      )
    } else if (!orderInfo.addressId) {
      return SelectAddress.GenerateMessage({}, customer, sessionData)
    } else {
      return new StepInfo(
        [
          "Todos os dados foram coletados corretamente!",
          "Vamos só confirmar os dados do pedido, ok?",
          "Vou lhe enviar as informações de seu pedido, caso algumas delas estiver errada favor *digitar o número* da mesma para corrigirmos.",
          `Caso esteja tudo certo digite *${OrderConfirmationAnswers.OK}*`,
          ...ConfirmOrderStep.GenerateConfirmationMessage(orderInfo, sessionData.branchData, customer)
        ],
        StepNumbers.confirmOrder,
      )
    }
  }
}