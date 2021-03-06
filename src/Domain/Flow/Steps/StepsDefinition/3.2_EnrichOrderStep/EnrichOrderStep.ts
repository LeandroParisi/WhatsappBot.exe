import staticImplements from "../../../../../Shared/Anotations/staticImplements"
import Customer from "../../../../../Data/Models/Customer"
import IStep, { IStepOptions, StepNumbers } from "../../Interfaces/IStep"
import StepInfo from "../../Messages/StepInfo"
import { SessionData } from "../../../Startup/BotCore"
import Order from "../../../../../Data/Models/Order"
import { ActionsEnum } from "../../../StepActions/Interfaces/IActionHandler"
import SelectAddress from "../StepGenerators/SelectAddress"
import StepDefinition, { StepDefinitionArgs } from "../../Interfaces/StepDefinition"
import ConfirmOrderStep from "../8_ConfirmOrder/ConfirmOrder"
import SelectCoupomStep from "./3.2.5_SelectCoupom/SelectCoupomStep"
import SetCommentStep from "./3.2.4_SetComments/SetCommentStep"
import StepError from "../../../../Abstractions/Errors/StepError"
import { CurrentlyRegisteringOrder } from "../../../../../Data/Enums/CurrentlyRegisteringOrder"

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
    super(stepDefinitionArgs)
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
    if (orderInfo.currentlyRegistering === CurrentlyRegisteringOrder.DELIVERY_TYPE) {
      return new StepInfo(
        [
          "Precisamos preencher alguns dados de seu pedido.",
          "Favor digitar o número do tipo de entrega que prefere:",
          sessionData.branchData.templateMessages.deliveryTypes,
        ],
        StepNumbers.selectDeliveryType
      )
    } 
    else if (orderInfo.currentlyRegistering === CurrentlyRegisteringOrder.PAYMENT_METHOD) {
      return new StepInfo(
        [
          "Precisamos preencher alguns dados de seu pedido.",
          "Favor digitar o número do tipo de pagamento que prefere:",
          sessionData.branchData.templateMessages.paymentMethods,
        ],
        StepNumbers.selectPaymentMethod
      )
    } 
    else if (orderInfo.currentlyRegistering === CurrentlyRegisteringOrder.ADDRESS) {
      return SelectAddress.GenerateMessage({}, customer, sessionData)
    } 
    else if (orderInfo.currentlyRegistering === CurrentlyRegisteringOrder.DELIVERY_FEE) {
      return new StepInfo(
        [
          "Agora vamos calcular a taxa de entrega e já já damos continuidade ao pedido."
        ],
        undefined,
        [ActionsEnum.CALCULATE_FARES],
        [orderInfo]
      )
    }
    else if (orderInfo.currentlyRegistering === CurrentlyRegisteringOrder.COMMENTS) {
      return new StepInfo(
        [
          ...SetCommentStep.INTRO_MESSAGES,
        ],
        StepNumbers.setComment 
      )
    }
    else if (orderInfo.currentlyRegistering === CurrentlyRegisteringOrder.COUPOM) {
      return new StepInfo(
        [
          "Deseja aplicar algum cupom no seu pedido?",
          ...SelectCoupomStep.INTRO_MESSAGES,
        ],
        StepNumbers.selectCoupom
      )
    }
    else if (orderInfo.currentlyRegistering === CurrentlyRegisteringOrder.FINISHED){
      return new StepInfo(
        [
          ...ConfirmOrderStep.GenerateConfirmationMessage(orderInfo, sessionData.branchData, customer)
        ],
        StepNumbers.confirmOrder,
      )
    }
    else {
      throw new StepError(this.STEP_NUMBER, `Invalid order currently Registering status ${orderInfo.currentlyRegistering}`)
    }
  }
}