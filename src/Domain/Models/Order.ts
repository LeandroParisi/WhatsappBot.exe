import IOrderInfo, { OrderStatusEnum } from "../../data/Interfaces/IOrderInfo";
import DaysUtils from "../../Shared/Utils/DaysUtils";
import Address from "./Address";
import { v4 as uuid } from 'uuid';

export default class Order implements IOrderInfo {
  _id: string;
  customerId: string;
  promotionId?: number;
  status: OrderStatusEnum;
  createdAt: Date;
  deliveryTypeId? : number
  address? : Address
  paymentMethodId? : number

  /**
   *
   */
  constructor(
    customerId : string,
    promotionId : number,
    status : OrderStatusEnum
  ) {
    this._id = uuid()
    this.customerId = customerId
    this.promotionId = promotionId
    this.status = status
    this.createdAt = DaysUtils.GetDateFromTimestamp(Date.now() / 1000)
  }
}