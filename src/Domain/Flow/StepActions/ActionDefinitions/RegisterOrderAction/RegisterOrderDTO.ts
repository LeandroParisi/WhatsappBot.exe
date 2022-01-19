import Order from "../../../../Models/Order"
import Payload from "../../DTOs/Payload"

export class RegisterOrderDTO extends Order implements Payload {
  constructor(order : Order) {
    super(order.customerId, order.branchId, order.promotionId, order.status)
  }
}
