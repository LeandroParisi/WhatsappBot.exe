export default interface IOrderInfo {
  branchId : string
  customerId : string
  addressId? : string
  subTotal : number
  deliveryTypeId? : number
  deliveryFee : number
  paymentMethodId? : number
  totalPrice : number
  status : string
  coupomId? : number
  promotionId?: number;
  estimatedDeliveryDuration : number
  comments : string
}