
import { v4 as uuid } from 'uuid';
import IOrderInfo, { OrderStatusEnum } from '../../../../../data/Interfaces/IOrderInfo';
import Order from '../../../Models/Order';
import Payload from "./Payload";

// TODO: mudar o payload para inteerface e extender o Order?
export default class OrderDTO extends Order implements Payload, IOrderInfo  {
  constructor(order : Order) {
    super(order.customerId, order.branchId, order.promotionId, order.status, order._id)
    this.createdAt= order.createdAt;
    this.promotionId = order.promotionId;
    this.deliveryTypeId = order.deliveryTypeId
    this.addressId = order.addressId
    this.paymentMethodId = order.paymentMethodId
  
  }

}