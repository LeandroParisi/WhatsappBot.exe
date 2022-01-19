import IOrderInfo, { OrderStatusEnum } from "../../../data/Interfaces/IOrderInfo";
import DaysUtils from "../../Shared/Utils/DaysUtils";
import { v4 as uuid } from 'uuid';

export default class Order implements IOrderInfo {
  _id : string;
  customerId : string;
  branchId : string;
  status: OrderStatusEnum;
  createdAt: Date;
  promotionId?: number;
  deliveryTypeId? : number
  addressId? : number
  paymentMethodId? : number

  /**
   *
   */
  constructor(
    customerId : string,
    branchId : string,
    promotionId : number,
    status : OrderStatusEnum,
    _id? : string
  ) {
    this._id = _id || uuid()
    this.customerId = customerId
    this.promotionId = promotionId
    this.branchId = branchId
    this.status = status
    this.createdAt = DaysUtils.GetDateFromTimestamp(Date.now() / 1000)
  }
}