import { OrderStatusValues } from "../Enums/OrderStatus"
import { PaymentMethodsKeys, PaymentMethodsValues } from "../Enums/PaymentMethods"

export default interface IOrderInfo {
  branchId : string
  customerId : string
  addressId? : string
  subTotal : number
  deliveryTypeId? : number
  deliveryFee : number
  paymentMethodId? : PaymentMethodsKeys
  totalPrice : number
  status : OrderStatusValues
  coupomId? : number
  promotionId?: number;
  estimatedDeliveryDuration : number
  comments : string
}