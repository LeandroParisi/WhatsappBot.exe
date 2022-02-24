import { OrderSQL } from "../../../../data/Models/Order"

export default class CalculateFaresBody {
  id : string
  addressId : string
  branchId : string
  customerId : string
  deliveryTypeId : number
  paymentMethodId : number
  comments? : string
  coupomId? : number
  promotionId? : number
  createdAt? : Date

  /**
   *
   */
  constructor(order : OrderSQL) {
    this.id = order.id
    this.addressId = order.addressId
    this.branchId = order.branchId
    this.customerId = order.customerId
    this.deliveryTypeId = order.deliveryTypeId
    this.paymentMethodId = order.paymentMethodId
    this.comments = order.comments
    this.coupomId = order.coupomId
    this.promotionId = order.promotionId
    this.createdAt = order.createdAt
    
  }
}