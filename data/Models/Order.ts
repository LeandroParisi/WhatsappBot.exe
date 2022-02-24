import IOrderInfo from "../Interfaces/IOrderInfo"
import DaysUtils from "../../src/Shared/Utils/DaysUtils"
import { v4 as uuid } from 'uuid'
import Payload from "../../src/Domain/Flow/StepActions/DTOs/Base/Payload"
import { 
  CurrentlyRegisteringOrder,
   CurrentlyRegisteringOrderValues,
   NextEditStep,
   NextStep 
  } from "../Enums/CurrentlyRegisteringOrder"
import { CalculatedFares } from "../../src/Services/TaonBackend/Responses/CalculateFaresResponse"

export default class Order implements IOrderInfo, Payload {
  _id : string; //
  branchId : string //
  customerId : string //
  addressId? : string //
  subTotal : number
  deliveryTypeId? : number //
  deliveryFee : number
  paymentMethodId? : number //
  totalPrice : number
  status : string
  coupomId? : number
  promotionId?: number //
  estimatedDeliveryDuration : number
  distanceInKm: number
  comments : string
  createdAt: Date;
  
  // Bot exclusive properties
  freeDelivery?: boolean
  currentlyRegistering : CurrentlyRegisteringOrderValues
  isEdit : boolean
  coupomCode? : string

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
    this.isEdit = false
    // this.currentlyRegistering = CurrentlyRegisteringOrder.DELIVERY_TYPE

    // TODO: TEST
    this.deliveryTypeId = 1
    this.paymentMethodId = 1
    this.currentlyRegistering = CurrentlyRegisteringOrder.ADDRESS
  }

  UpdateFares(calculatedFares : CalculatedFares) {
    const { deliveryFee, distanceInKm, estimatedDeliveryDuration, subTotal, totalPrice } = calculatedFares

    this.estimatedDeliveryDuration = estimatedDeliveryDuration
    this.subTotal = subTotal
    this.distanceInKm = distanceInKm
    this.totalPrice = totalPrice
    this.deliveryFee = deliveryFee
  }

  GetNextOrderRegisteringStep() : void {
    console.log({before: this.currentlyRegistering})
    if (this.isEdit) {
      this.currentlyRegistering = NextEditStep[this.currentlyRegistering]
    } else {
      this.currentlyRegistering = NextStep[this.currentlyRegistering]
    }
    console.log({after: this.currentlyRegistering})

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

  /**
   *
   */
  constructor(
     order : Order
  ) {
    this.id = order._id
    this.branchId = order.branchId
    this.customerId = order.customerId
    this.addressId = order.addressId
    this.subTotal = order.subTotal
    this.deliveryTypeId = order.deliveryTypeId
    this.deliveryFee = order.deliveryFee
    this.paymentMethodId = order.paymentMethodId
    this.totalPrice = order.totalPrice
    this.status = order.status
    this.coupomId = order.coupomId
    this.promotionId = order.promotionId
    this.estimatedDeliveryDuration = order.estimatedDeliveryDuration
    this.distanceInKm = order.distanceInKm
    this.comments = order.comments
    this.createdAt = order.createdAt
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

export function CreateOrder(order : Order) : Order {
  const createdOrder = new Order(order.customerId, order.branchId, order.promotionId, order._id)
  createdOrder.addressId = order.addressId
  createdOrder.subTotal = order.subTotal
  createdOrder.deliveryTypeId = order.deliveryTypeId
  createdOrder.deliveryFee = order.deliveryFee
  createdOrder.paymentMethodId = order.paymentMethodId
  createdOrder.totalPrice = order.totalPrice
  createdOrder.status = order.status
  createdOrder.coupomId = order.coupomId
  createdOrder.estimatedDeliveryDuration = order.estimatedDeliveryDuration
  createdOrder.distanceInKm= order.distanceInKm
  createdOrder.freeDelivery= order.freeDelivery
  createdOrder.comments = order.comments
  createdOrder.createdAt= order.createdAt
  createdOrder.currentlyRegistering= order.currentlyRegistering
  createdOrder.isEdit= order.isEdit
  createdOrder.coupomCode= order.coupomCode


  return createdOrder
}


