import IOrderInfo from "../Interfaces/IOrderInfo";
import DaysUtils from "../../src/Shared/Utils/DaysUtils";
import { v4 as uuid } from 'uuid';
import Payload from "../../src/Domain/Flow/StepActions/DTOs/Payload";

export default class Order implements IOrderInfo, Payload {
  _id : string; //
  branchId : string //
  customerId : string //
  addressId? : string //
  orderNumber : number //
  subTotal : number
  deliveryTypeId? : number //
  deliveryFee : number
  paymentMethodId? : number //
  discount : number
  totalPrice : number
  status : string
  coupomId : number
  promotionId?: number //
  estimatedDeliveryTime : string
  comments : string
  dispatchTime : Date
  deliveryTime : Date
  createdAt: Date;

  /**
   *
   */
  constructor(
    customerId : string,
    branchId : string,
    promotionId : number,
    _id? : string
  ) {
    this._id = _id || uuid()
    this.customerId = customerId
    this.promotionId = promotionId
    this.branchId = branchId
    this.createdAt = DaysUtils.GetDateFromTimestamp(Date.now() / 1000)
  }
}