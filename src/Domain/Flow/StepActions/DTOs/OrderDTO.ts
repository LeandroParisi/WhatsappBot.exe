
import { v4 as uuid } from 'uuid';
import IOrderInfo, { OrderStatusEnum } from '../../../../../data/Interfaces/IOrderInfo';
import Order from '../../../Models/Order';
import Payload from "./Payload";

export default class OrderDTO extends Payload implements IOrderInfo  {
  _id: string;
  customerId: string;
  branchId: string;
  promotionId?: number;
  status: OrderStatusEnum;
  createdAt: Date;
  deliveryTypeId? : number
  addressId? : number
  paymentMethodId? : number

  /**
   *
   */
  constructor(
    order : Order
  ) {
    super()
    this._id = order._id
    this.customerId = order.customerId
    this.branchId = order.branchId
    this.promotionId = order.promotionId
    this.status = order.status
    this.createdAt = order.createdAt
    this.deliveryTypeId = order.deliveryTypeId
    this.addressId = order.addressId
    this.paymentMethodId = order.paymentMethodId
  }
}