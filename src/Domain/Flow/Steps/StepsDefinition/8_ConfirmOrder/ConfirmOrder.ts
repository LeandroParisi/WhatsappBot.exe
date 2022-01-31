import BranchData, { DeliveryType, PaymentMethod, Promotion } from "../../../../../../data/Interfaces/BranchData"
import staticImplements from "../../../../../Shared/Anotations/staticImplements"
import AddressParser from "../../../../../Shared/Parsers/AddressParser"
import PromotionsUtils from "../../../../../Shared/Utils/PromotionsUtils"
import Customer from "../../../../Models/Customer"
import CustomerAddress from "../../../../Models/CustomerAddress"
import Order from "../../../../Models/Order"
import Validations from "../../../Utils/Validations"
import IStep, { StepNumbers } from "../../Interfaces/IStep"
import IValidatedStep, { ValidateParameters } from "../../Interfaces/IValidatedStep"
import StepDefinition from "../../Interfaces/StepDefinition"
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
export default class ConfirmOrderStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.confirmOrder
  
  public async Interact() : Promise<StepInfo> {
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

    const address = AddressParser.ParseAddressToText(
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

  private ValidateAnswer() : ValidationPayload {
    const formattedAnswer = this.Answer.trim()
    const isValid = Object.values(OrderConfirmationOptions).includes(formattedAnswer) && Validations.IsNumber(this.Answer)

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