import { Message } from "venom-bot";
import BranchData from "../../../../../../data/DTOs/BranchData";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../../../data/Models/Customer";
import IStep, { IStepOptions, StepNumbers } from "../../Interfaces/IStep";
import MainMenu from "../10_MainMenu/MainMenu";
import StepInfo from "../../Messages/StepInfo";
import { SessionData } from "../../../Startup/BotCore";
import Order from "../../../../../../data/Models/Order";
import { ActionsEnum } from "../../../StepActions/Interfaces/IActionHandler";
import SelectAddress from "../StepGenerators/SelectAddress";
import StepDefinition, { StepDefinitionArgs } from "../../Interfaces/StepDefinition";
import ConfirmOrderStep, { OrderConfirmationAnswers } from "../8_ConfirmOrder/ConfirmOrder";

@staticImplements<IStep>()
@staticImplements<IStepOptions>()

export default class EnrichOrderStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.enrichOrderStep
  static ORDER_STEP = true
  static ADDRESS_STEP = false

  /**
    *
  */
   constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs);
    this.ORDER_STEP = EnrichOrderStep.ORDER_STEP
    this.ADDRESS_STEP = EnrichOrderStep.ADDRESS_STEP
  }
  
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
    } 
    else if (!orderInfo.paymentMethodId) {
      return new StepInfo(
        [
          "Precisamos preencher alguns dados de seu pedido.",
          "Favor digitar o número do tipo de pagamento que prefere:",
          sessionData.branchData.templateMessages.paymentMethods,
        ],
        StepNumbers.selectPaymentMethod
      )
    } 
    else if (!orderInfo.addressId) {
      return SelectAddress.GenerateMessage({}, customer, sessionData)
    } 
    else if (!orderInfo.coupomId) {
      throw new Error("Must be implemented")
    }
    else if (!orderInfo.deliveryFee) {
      throw new Error("Must be implemented")
    }
    else if (!orderInfo.estimatedDeliveryTime) {
      throw new Error("Must be implemented") // ?
    }
    else if (!orderInfo.comments) {
      throw new Error("Must be implemented")
    }
    else {
      return new StepInfo(
        [
          ...ConfirmOrderStep.GenerateConfirmationMessage(orderInfo, sessionData.branchData, customer)
        ],
        StepNumbers.confirmOrder,
      )
    }
  }
}