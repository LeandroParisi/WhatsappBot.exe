import BranchData, { DeliveryType, PaymentMethod, Promotion } from "../../../../../../data/DTOs/BranchData"
import staticImplements from "../../../../../Shared/Anotations/staticImplements"
import AddressParser from "../../../../../Shared/Parsers/AddressParser"
import PromotionsUtils from "../../../../../Shared/Utils/PromotionsUtils"
import Customer from "../../../../../../data/Models/Customer"
import CustomerAddress from "../../../../../../data/Models/CustomerAddress"
import Order from "../../../../../../data/Models/Order"
import Validations from "../../../Utils/Validations"
import IStep, { IStepOptions, StepNumbers } from "../../Interfaces/IStep"
import IValidatedStep, { ValidateParameters } from "../../Interfaces/IValidatedStep"
import StepDefinition, { StepDefinitionArgs } from "../../Interfaces/StepDefinition"
import StepInfo from "../../Messages/StepInfo"
import Container from "typedi"
import AddressesRepository from "../../../../../Services/SessionManagement/Repositories/AddressesRepository"
import PaymentMethodsUtils from "../../../../../Shared/Utils/PaymentMethodsUtils"
import DeliveryTypeUtils from "../../../../../Shared/Utils/DeliveryTypeUtils"
import GenericParser from "../../../../../Shared/Parsers/GenericParser"

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
  promotion = 1,
  deliveryType = 2,
  paymentMethod = 3,
  address = 4,
  comment = 5,
  subTotal = 6,
  deliveryFee = 7,
  totalPrice = 8,
}

@staticImplements<IStep>()
@staticImplements<IStepOptions>()
export default class ConfirmOrderStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.confirmOrder
  static ADDRESS_STEP = false
  static ORDER_STEP = true

  /**
  *
  */
    constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs);
    this.ORDER_STEP = ConfirmOrderStep.ORDER_STEP
    this.ADDRESS_STEP = ConfirmOrderStep.ADDRESS_STEP
  }
  
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
      .find((d : DeliveryType) => d.id === orderInfo.deliveryTypeId).deliveryType
      
    const paymentMethod = branchData.paymentMethods
      .find((p : PaymentMethod) => p.id === orderInfo.paymentMethodId).paymentMethod
    
      const address = AddressParser.ParseAddressToText(
      customer.info.customerAddresses
      .find((a : CustomerAddress) => a._id === orderInfo.addressId)
    )


    return [
        "Vamos só confirmar os dados do pedido, ok?",
        "Vou lhe enviar as informações:",
        `*${OrderConfirmationOptions.promotion}. Promoção:*\n${promoInfo}${productInfo}`,
        `*${OrderConfirmationOptions.deliveryType}. Tipo de entrega:*\n${DeliveryTypeUtils.TranslateToPt(deliveryType)}`,
        `*${OrderConfirmationOptions.paymentMethod}. Método de pagamento:*\n${PaymentMethodsUtils.TranslateToPt(paymentMethod)}`,
        `*${OrderConfirmationOptions.address}. Endereço:*\n${address}`,
        `*${OrderConfirmationOptions.comment}. Comentário:*\n${orderInfo.comments || "Nenhum"}`,
        `*${OrderConfirmationOptions.subTotal}. Sub Total:*\n${GenericParser.FormatPrice(
          {price:orderInfo.subTotal , decimal: true}
        )}`,
        `*${OrderConfirmationOptions.deliveryFee}. Taxa de entrega:*\n${GenericParser.FormatPrice(
          {price:orderInfo.deliveryFee , decimal: true}
        )}`,
        `*${OrderConfirmationOptions.totalPrice}. Total (Sub Total + Taxa de entrega):*\n${GenericParser.FormatPrice(
          {price:orderInfo.totalPrice , decimal: true}
        )}`,

        `Caso algumas delas estiver errada favor *digitar o número* da mesma para corrigirmos. Mas se estiver tudo certo digite *${OrderConfirmationAnswers.OK}*`,
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