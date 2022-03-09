import staticImplements from "../../Shared/Anotations/staticImplements"
import AddressParser from "../../Shared/Parsers/AddressParser"
import CustomerAddress from "../../../data/Models/CustomerAddress"
import { OrderSQL } from "../../../data/Models/Order"
import { StatusTranslations } from "../../../data/Enums/OrderStatus"
import DeliveryTypeUtils from "../../Shared/Utils/DeliveryTypeUtils"
import PaymentMethodsUtils from "../../Shared/Utils/PaymentMethodsUtils"
import GenericParser from "../../Shared/Parsers/GenericParser"
import moment from "moment"


@staticImplements()
export default class CustomerTemplateMessagesFactory {
  static GenerateAddressMessage(addresses : Array<CustomerAddress>) : string {
    return addresses.map((a: CustomerAddress, index : number) => {
      return `${index + 1}. ${AddressParser.ParseAddressToText(a)}`
    }).join('\n\n')
  }

  static GeneratePendingOrdersMessage(orders : OrderSQL[]) : string {
    return orders.map((o : OrderSQL) => {
      return `
      *Pedido ${o.orderNumber}*:\n
      *Status*: ${StatusTranslations[o.status]}\n
      ${o.dispatchTime ? `*Hora de envio:* ${moment(o.dispatchTime).utcOffset(-3).calendar({
        sameDay: '[Hoje] HH:mm',
        nextDay: '[Amanhã] HH:mm',
        lastDay: '[Ontem] HH:mm',
        lastWeek: '[Semana Passada] HH:mm',
        sameElse: 'DD/MM/YYYY HH:mm'
      })}\n` : ''}
      *Tipo de entrega:* ${DeliveryTypeUtils.TranslateToPtFromNumber(o.deliveryTypeId)}\n
      *Método de pagamento:* ${PaymentMethodsUtils.TranslateToPtFromNumber(o.paymentMethodId)}\n
      *Comentário:* ${o.comments || "Nenhum"}\n
      *Sub Total:* ${GenericParser.FormatPrice({price: o.subTotal , decimal: true})}\n
      *Taxa de entrega:* ${GenericParser.FormatPrice({price: o.deliveryFee , decimal: true})}\n
      *Total (Sub Total + Taxa de entrega):* ${GenericParser.FormatPrice({price: o.totalPrice , decimal: true})}\n
      `
    }).join('\n\n')
  }
}