import BranchData, { DeliveryType, PaymentMethod, Promotion } from "../../../../../../data/DTOs/BranchData"
import staticImplements from "../../../../../Shared/Anotations/staticImplements"
import AddressParser from "../../../../../Shared/Parsers/AddressParser"
import PromotionsUtils from "../../../../../Shared/Utils/PromotionsUtils"
import Customer from "../../../../../../data/Models/Customer"
import CustomerAddress from "../../../../../../data/Models/CustomerAddress"
import Order from "../../../../../../data/Models/Order"
import Validations from "../../../Utils/Validations"
import IStep, { IOptionsAnswer, IStepOptions, StepNumbers } from "../../Interfaces/IStep"
import StepDefinition, { StepDefinitionArgs } from "../../Interfaces/StepDefinition"
import StepInfo from "../../Messages/StepInfo"
import PaymentMethodsUtils from "../../../../../Shared/Utils/PaymentMethodsUtils"
import DeliveryTypeUtils from "../../../../../Shared/Utils/DeliveryTypeUtils"
import GenericParser from "../../../../../Shared/Parsers/GenericParser"
import { OrderConfirmationAnswers, OrderConfirmationOptions, OrderConfirmationOptionsValues, OrderConfirmationPossibleEdits, OrderConfirmationPossibleEditsValues, OrderOptionsTranslation, ValidationPayload } from "./Enums"
import { ActionsEnum } from "../../../StepActions/Interfaces/IActionHandler"
import { CurrentlyRegisteringOrder } from "../../../../../../data/Enums/CurrentlyRegisteringOrder"
import EnrichOrderStep from "../3.2_EnrichOrderStep/EnrichOrderStep"
import ActionsUtils from "../../../Utils/ActionsUtils"



@staticImplements<IStep>()
@staticImplements<IStepOptions>()
export default class ConfirmOrderStep extends StepDefinition implements IOptionsAnswer {
  static STEP_NUMBER = StepNumbers.confirmOrder
  static ADDRESS_STEP = false
  static ORDER_STEP = true

  formattedAnswer: string | number

  /**
  *
  */
    constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs)
    this.ORDER_STEP = ConfirmOrderStep.ORDER_STEP
    this.ADDRESS_STEP = ConfirmOrderStep.ADDRESS_STEP
  }
  
  public async Interact() : Promise<StepInfo> {
    const validationPayload = this.ValidateAnswer()

    return this.GenerateAnswer(validationPayload)
  }

  private GenerateAnswer(validationPayload: ValidationPayload): StepInfo  {
    const { isValid, selectedOption } = validationPayload

    if (!isValid) {
      return new StepInfo(
        [
          'Desculpe, a opção que você escolheu não é válida.',
          'Vamos tentar de novo?',
          ...ConfirmOrderStep.GenerateConfirmationMessage(this.OrderInfo, this.SessionData.branchData, this.Customer)
        ],
        StepNumbers.confirmOrder
      )
    }
    else {
      if (selectedOption === OrderConfirmationAnswers.OK) {
        return new StepInfo(
          [
            'Perfeito! Irei processar seu pedido.',
            'Favor aguardar um pouco, já já lhe envio a confirmação'
          ],
          StepNumbers.closingStep,
          [ActionsEnum.SEND_ORDER],
          [this.OrderInfo]
        )
      } else if (selectedOption === OrderConfirmationAnswers.CANCELAR) {
        throw new Error("implementar cancelamento do pedido")
      }
      else {
        return this.EditOrderSwitch(selectedOption)
      }
    }
  }

  private EditOrderSwitch(selectedOption: number): StepInfo {
    this.OrderInfo.isEdit = true

    switch(selectedOption) {
      case (OrderConfirmationPossibleEdits.deliveryType):
        this.OrderInfo.currentlyRegistering = CurrentlyRegisteringOrder.DELIVERY_TYPE
        break
      case (OrderConfirmationPossibleEdits.paymentMethod):
        this.OrderInfo.currentlyRegistering = CurrentlyRegisteringOrder.PAYMENT_METHOD
        break
      case (OrderConfirmationPossibleEdits.address):
        this.OrderInfo.currentlyRegistering = CurrentlyRegisteringOrder.ADDRESS
        break
      case (OrderConfirmationPossibleEdits.comment):
        this.OrderInfo.currentlyRegistering = CurrentlyRegisteringOrder.COMMENTS
        break
      default:
        throw new Error("Invalid order confirmation option")
    }

    const nextStep = EnrichOrderStep.ExtractMissingOrderInfo(this.OrderInfo, this.SessionData, this.Customer)

    return new StepInfo(
      nextStep.outboundMessages,
      nextStep.nextStep,
      [ActionsEnum.UPDATE_ORDER, ...ActionsUtils.ExtractActions(nextStep)],
      [this.OrderInfo, ...ActionsUtils.ExtractActionsPayload(nextStep)]
    )
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

        `Você pode editar as seguintes opções: ${ConfirmOrderStep.GetEditOptions()}`,
        'Para editar basta digitar o número correspondente',
        `Ou, se estiver tudo ok, digite *${OrderConfirmationAnswers.OK}* para finalizarmos seu pedido`,
    ]
  }

  static GetEditOptions() : string {
    const possibleEditsNumbers = Object.values(OrderConfirmationPossibleEdits)

    return possibleEditsNumbers
      .map((optionNumber : number) => `*${OrderOptionsTranslation[optionNumber as OrderConfirmationOptionsValues]}*`)
      .join(', ')
  }

  private ValidateAnswer() : ValidationPayload {
    const formattedAnswer = this.Answer.trim()
    const isEdit = Object.values(OrderConfirmationPossibleEdits)
      .includes(Number(formattedAnswer) as OrderConfirmationPossibleEditsValues) 
      && Validations.IsNumber(this.Answer)

    const isConfirmation = formattedAnswer.toUpperCase() === OrderConfirmationAnswers.OK

    if (!isEdit && !isConfirmation) {
      return { isValid: false}
    } 
    if (isEdit) {
      return { isValid: true, selectedOption: Number(formattedAnswer) as OrderConfirmationPossibleEditsValues }
    }
    if (isConfirmation) {
      return { isValid: true, selectedOption: OrderConfirmationAnswers.OK}
    }
  }
}