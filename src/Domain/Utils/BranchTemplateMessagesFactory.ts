import { Promotion, Product, Attribute, AttributeTypes, OpeningHours, DayInfo, DeliveryType, DeliveryFees, DeliveryFeeTypesEnum, DeliveryFeeType, PaymentMethod, PromotionsInformation } from "../../data/Interfaces/BranchData";
import staticImplements from "../../Shared/Anotations/staticImplements";
import DaysUtils from "../../Shared/Utils/DaysUtils";
import DeliveryTypeUtils from "../../Shared/Utils/DeliveryTypeUtils";
import GenericParser from "../../Shared/Utils/GenericParser";
import PaymentMethodsUtils from "../../Shared/Utils/PaymentMethodsUtils";
import PromotionsUtils from "../../Shared/Utils/PromotionsUtils";
import SystemUtils from "../../Shared/Utils/SystemUtils";
import GenerateTemplateMessageError from "../Abstractions/Errors/GenerateTemplateMessageError";

@staticImplements()
export default class BranchTemplateMessagesFactory {
  static GenerateDeliveryTypesMessage(deliveryTypes: DeliveryType[]) {
    throw new Error("Method not implemented.");
  }
  static GeneratePromotionsMessage(avaiablePromotions : Promotion[]) : PromotionsInformation {
    if (avaiablePromotions.length === 0) {
      return {
        message: "Infelizmente hoje estamos sem nenhuma promoção disponível.",
        hasPromotions: false,
      } 
    }

    const message = avaiablePromotions.map((promotion : Promotion, promoIndex : number) => {
      const { promoInfo, productInfo } = PromotionsUtils.ParsePromotionToText(promotion)
      
      const promotionMessage =  `*${promoIndex + 1}.* ${promoInfo}`

      return promotionMessage + productInfo
    }).join("\n---\n\n")

    return {
      message,
      hasPromotions: true,
    }
  }

  static GenerateOpeningHoursMessage(openingHours : OpeningHours) : string {
    const openingHoursEntries = SystemUtils.GetObjectEntries(openingHours);

    const message = openingHoursEntries.map(([day, info]) => {
      let dayMessage = ""

      dayMessage += `${DaysUtils.TranslateToPt(day)}: `

      if (info.isOpened) {
        if (info.overnight) {
          dayMessage += `${info.hours[0]} - ${info.hours[1]} do dia seguinte`
        } else {
          dayMessage += `${info.hours[0]} - ${info.hours[1]}`
        }
      } else {
        dayMessage += 'Fechado'
      }

      return dayMessage
    })

    return message.join("\n")
  }

  static GenerateDeliveryInformationMessage(deliveryTypes : Array<DeliveryType>, deliveryFees : DeliveryFees) : string {
    let message = ""

    message += this.CreateDeliveryTypeText(deliveryTypes)

    message += this.CreateDeliveryFeeText(deliveryFees)

    return message
  }


  static GeneratePaymentMethodsMessage(paymentMethods : Array<PaymentMethod>) : string {
    if (paymentMethods.length === 0) return "Atualmente não aceitamos nenhum método de pagamento"

    let message = "Atualmente aceitamos os seguintes métodos de pagamento:\n"
    
    return message + paymentMethods.map((paymentMethod  : PaymentMethod, index : number) => {
      return `${index + 1}. ${PaymentMethodsUtils.TranslateToPt(paymentMethod.paymentMethod)}`
    }).join("\n")

  }

  private static CreateDeliveryFeeText(deliveryFees: DeliveryFees) {
    let deliveryFeeText = "*Taxas:*\n"

    if (deliveryFees.type === DeliveryFeeTypesEnum.UNIQUE) {
      return deliveryFeeText += this.ParseUniqueFeeType(deliveryFees.fees)
    }
    if (deliveryFees.type === DeliveryFeeTypesEnum.RADIUS) {
      return deliveryFeeText += this.ParseRadiusFeeType(deliveryFees.fees)
    }
    
    throw new GenerateTemplateMessageError(`Invalid deliveryFeeType ${deliveryFees.type}. Unable to generate template message on ${typeof this.CreateDeliveryFeeText}`)
    
  }

  // TODO: tipar corretamente o fees
  private static ParseRadiusFeeType(fees: any) : string {
    let message = "Nossa taxa de entrega é cobrada baseada na distância, da seguinte forma:\n"

    message += fees.map(([distance, price] : Array<number>, index : number, feesArray: Array<Array<number>>) => {
      if (!index) return `Até ${distance} KM: ${GenericParser.FormatPrice({ price, decimal: true })}`
      return `Entre ${feesArray[index - 1][0]} e ${distance} Kms: ${GenericParser.FormatPrice({ price, decimal: true })}`
    }).join("\n")

    return message
  }

  private static ParseUniqueFeeType(fees: DeliveryFeeType) : string {
    if (!fees) return "Gratuito"
    return `Cobramos uma taxa única de ${fees}`
  }

  public static CreateDeliveryTypeText(deliveryTypes: Array<DeliveryType>) {
    let deliveryTypeText = "*Tipos de entrega:*\n"

    if (deliveryTypes.length === 0) return deliveryTypeText += "Por enquanto não temos nenhum tipo de modo de entrega\n\n"
    
    deliveryTypeText += deliveryTypes.map(
      (deliveryType : DeliveryType, index : number) => {
      return `${index + 1}. ${DeliveryTypeUtils.TranslateToPt(deliveryType.deliveryType)}`
    }).join('\n')

    deliveryTypeText += "\n\n"

    return deliveryTypeText
  }
}