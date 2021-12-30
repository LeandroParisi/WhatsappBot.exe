import Address from "../../../Models/Address"
import Payload from "./Payload"

export class BuyPromotionPayload extends Payload {
  promotionId : number
  branchId : string
  deliveryTypeId : number
  address : Address
  paymentMethodId : number

  constructor(promotionId : number, branchId : string) {
    super()
    this.promotionId = promotionId
    this.branchId = branchId
  }
}
