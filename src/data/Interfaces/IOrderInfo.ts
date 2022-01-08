export enum OrderStatusEnum {
  REGISTERED = 'REGISTERED'
}

export default interface IOrderInfo {
  _id? : string
  customerId : string
  promotionId? : number
  status : OrderStatusEnum
  createdAt : Date
}