import Address from "../../../../Models/Address"
import Payload from "../../DTOs/Payload"

export class RegisterOrderDTO extends Payload {
  promotionId : number
  branchId : string

  constructor(promotionId : number, branchId : string) {
    super()
    this.promotionId = promotionId
    this.branchId = branchId
  }
}
