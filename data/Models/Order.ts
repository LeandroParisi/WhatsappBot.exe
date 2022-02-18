import IOrderInfo from "../Interfaces/IOrderInfo";
import DaysUtils from "../../src/Shared/Utils/DaysUtils";
import { v4 as uuid } from 'uuid';
import Payload from "../../src/Domain/Flow/StepActions/DTOs/Payload";
import { CurrentlyRegisteringOrder, CurrentlyRegisteringOrderValues } from "../Enums/CurrentlyRegisteringOrder";

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
  coupomId? : number
  promotionId?: number //
  estimatedDeliveryDuration : number
  distanceInKm: number
  freeDelivery?: boolean
  comments : string
  dispatchTime : Date
  deliveryTime : Date
  createdAt: Date;
  currentlyRegistering : CurrentlyRegisteringOrderValues

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
    this.coupomId = undefined
    this.createdAt = DaysUtils.GetDateFromTimestamp(Date.now() / 1000)
    // this.currentlyRegistering = CurrentlyRegisteringOrder.DELIVERY_TYPE

    // TODO: TEST
    this.deliveryTypeId = 1
    this.paymentMethodId = 1
    this.currentlyRegistering = CurrentlyRegisteringOrder.ADDRESS
  }
}

export class OrderSQL implements IOrderInfo, Payload {
  id : string; //
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
  coupomId? : number
  promotionId?: number //
  estimatedDeliveryDuration : number
  distanceInKm: number
  comments : string
  dispatchTime : Date
  deliveryTime : Date
  createdAt: Date;
  currentlyRegistering : CurrentlyRegisteringOrderValues

  /**
   *
   */
  constructor(
     order : Order
  ) {
    this.id = order._id
    this.customerId = order.customerId
    this.promotionId = order.promotionId
    this.branchId = order.branchId
    this.createdAt = order.createdAt
    this.deliveryTypeId = order.deliveryTypeId
    this.paymentMethodId = order.paymentMethodId
    this.coupomId = order.coupomId
    this.addressId = order.addressId
    this.comments = order.comments
  }

  MapToMongo() : Order {
    const order = new Order(this.customerId, this.branchId, this.promotionId, this.id)
    order.createdAt = this.createdAt
    order.deliveryTypeId = this.deliveryTypeId
    order.paymentMethodId = this.paymentMethodId
    order.coupomId = this.coupomId
    order.addressId = this.addressId
    order.comments = this.comments
  
    return order
  }
}