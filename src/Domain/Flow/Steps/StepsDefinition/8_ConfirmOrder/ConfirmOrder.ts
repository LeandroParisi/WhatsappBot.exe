import { Message } from "venom-bot"
import BranchData, { DeliveryType, PaymentMethod, Promotion } from "../../../../../../data/Interfaces/BranchData"
import ICustomerAddress from "../../../../../../data/Interfaces/ICustomerAddress"
import staticImplements from "../../../../../Shared/Anotations/staticImplements"
import AddressUtils from "../../../../../Shared/Utils/AddressUtils"
import PromotionsUtils from "../../../../../Shared/Utils/PromotionsUtils"
import Customer from "../../../../Models/Customer"
import CustomerAddress from "../../../../Models/CustomerAddress"
import Order from "../../../../Models/Order"
import { SessionData } from "../../../Startup/BotStartUp"
import Validations from "../../../Utils/Validations"
import IStep, { StepInteractionPayload, StepNumbers } from "../../Interfaces/IStep"
import IValidatedStep, { ValidateParameters } from "../../Interfaces/IValidatedStep"
import StepInfo from "../../Messages/StepInfo"

export enum OrderConfirmationAnswers {
  OK = "OK"
}

enum SelectedOption {
  changePromotion = StepNumbers.promotionStep,
  changeDeliveryType = StepNumbers.selectDeliveryType,
  // changeAddress = StepNumbers. Alterar um endereço????
  changePaymentMethod = StepNumbers.selectPaymentMethod
}

interface ValidationPayload {
  isValid : boolean
  selectedOption? : SelectedOption
}

export enum OrderConfirmationOptions {
  promotionId = 1,
  deliveryTypeId = 2,
  addressId = 3,
  paymentMethodId = 4,
}

@staticImplements<IStep>()
@staticImplements<IValidatedStep<ValidationPayload>>()
export default class ConfirmOrderStep {
  static STEP_NUMBER = StepNumbers.confirmOrder
  
  static Interact({
    customer,
    message,
    sessionData,
    orderInfo,
    } : StepInteractionPayload
    ) : StepInfo {
      throw new Error()
  }

  public static GenerateConfirmationMessage(
    orderInfo : Order,
    branchData : BranchData,
    customer : Customer,
    ) : string[] {

    const {
      promoInfo, 
      productInfo 
    } = PromotionsUtils.ParsePromotionToText(
      branchData.promotions
        .find((p : Promotion) => p.id === orderInfo.promotionId)
    )

    const deliveryType = branchData.deliveryTypes
      .find((d : DeliveryType) => d.id === orderInfo.deliveryTypeId)

    const address = AddressUtils.ParseAddressToText(
      customer.info.customerAddresses
        .find((a : CustomerAddress) => a._id === orderInfo.addressId)
    )

    const paymentMethod = branchData.paymentMethods
      .find((p : PaymentMethod) => p.id === orderInfo.paymentMethodId)

    return [
      `*${OrderConfirmationOptions.promotionId} Promoção:*\n${promoInfo}${productInfo}`,
      `*${OrderConfirmationOptions.deliveryTypeId} Tipo de entrega:*\n${deliveryType}`,
      `*${OrderConfirmationOptions.addressId} Endereço:*\n ${address}`,
      `*${OrderConfirmationOptions.paymentMethodId} Método de pagamento:*\n ${paymentMethod}`,
    ]
  }

  static ValidateAnswer(
    {
      answer,
      sessionData,
    } : ValidateParameters
  ) : ValidationPayload {
    const formattedAnswer = answer.trim()
    const isValid = Object.values(OrderConfirmationOptions).includes(formattedAnswer) && Validations.IsNumber(answer)

    if (!isValid) {
      return {
        isValid
      }
    } else {
      return {
        isValid,
      }
    }
  }
}