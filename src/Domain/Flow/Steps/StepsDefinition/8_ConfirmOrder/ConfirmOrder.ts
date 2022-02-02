import BranchData, { DeliveryType, PaymentMethod, Promotion } from "../../../../../../data/DTOs/BranchData"
import staticImplements from "../../../../../Shared/Anotations/staticImplements"
import AddressParser from "../../../../../Shared/Parsers/AddressParser"
import PromotionsUtils from "../../../../../Shared/Utils/PromotionsUtils"
import Customer from "../../../../../../data/Models/Customer"
import CustomerAddress from "../../../../../../data/Models/CustomerAddress"
import Order from "../../../../../../data/Models/Order"
import Validations from "../../../Utils/Validations"
import IStep, { StepNumbers } from "../../Interfaces/IStep"
import IValidatedStep, { ValidateParameters } from "../../Interfaces/IValidatedStep"
import StepDefinition from "../../Interfaces/StepDefinition"
import StepInfo from "../../Messages/StepInfo"
import Container from "typedi"
import AddressesRepository from "../../../../../Services/SessionManagement/Repositories/AddressesRepository"
import PaymentMethodsUtils from "../../../../../Shared/Utils/PaymentMethodsUtils"
import DeliveryTypeUtils from "../../../../../Shared/Utils/DeliveryTypeUtils"

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
  paymentMethodId = 3,
  addressId = 4,
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
      .find((d : DeliveryType) => d.id === orderInfo.deliveryTypeId).deliveryType
      
    const paymentMethod = branchData.paymentMethods
      .find((p : PaymentMethod) => p.id === orderInfo.paymentMethodId).paymentMethod
    
      const address = AddressParser.ParseAddressToText(
      customer.info.customerAddresses
      .find((a : CustomerAddress) => a._id === orderInfo.addressId)
    )

    return [
        "Todos os dados foram coletados corretamente!",
        "Vamos só confirmar os dados do pedido, ok?",
        "Vou lhe enviar as informações de seu pedido:",
        `*${OrderConfirmationOptions.promotionId}. Promoção:*\n${promoInfo}${productInfo}`,
        `*${OrderConfirmationOptions.deliveryTypeId}. Tipo de entrega:*\n${DeliveryTypeUtils.TranslateToPt(deliveryType)}`,
        `*${OrderConfirmationOptions.paymentMethodId}. Método de pagamento:*\n${PaymentMethodsUtils.TranslateToPt(paymentMethod)}`,
        `*${OrderConfirmationOptions.addressId}. Endereço:*\n${address}`,
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

  private static async GetSelectedAddress(customer : Customer, orderInfo : Order,) {
    const addressesRepository = Container.get(AddressesRepository)

    const isOldAddress = customer.info.customerAddresses
      .find((a : CustomerAddress) => a._id === orderInfo.addressId)

    const isNewAddress = await addressesRepository.GetClientAddresses(customer._id)

    console.log({ isOldAddress})
    console.log({ isNewAddress})

  }
}