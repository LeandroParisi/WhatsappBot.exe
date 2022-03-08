import { OrderStatus, OrderStatusValues } from "../../../../../../../data/Enums/OrderStatus"

export default class CheckCustomerOrdersDTO {
  branchId : string
  customerId : string
  status : Array<OrderStatusValues>

  /**
   *
   */
  constructor(branchId : string, customerId : string) {
    this.branchId = branchId
    this.customerId = customerId    
    this.status = [OrderStatus.PLACED, OrderStatus.IN_PRODUCTION, OrderStatus.DISPATCHED]
  }
}