import Order from "../../../../../../Data/Models/Order"

export default class ValidateCoupomDTO {
  order : Order
  coupomCode : string

  /**
   *
   */
  constructor(order : Order, coupomCode : string) {
    this.order = order
    this.coupomCode = coupomCode
  }
}