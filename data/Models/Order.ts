import IOrderInfo, { OrderStatusEnum } from "../Interfaces/IOrderInfo";
import DaysUtils from "../../src/Shared/Utils/DaysUtils";
import { v4 as uuid } from 'uuid';
import Payload from "../../src/Domain/Flow/StepActions/DTOs/Payload";

export default class Order implements IOrderInfo, Payload {
  _id : string;
  customerId : string;
  branchId : string;
  status: OrderStatusEnum;
  createdAt: Date;
  promotionId?: number;
  deliveryTypeId? : number
  addressId? : string
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