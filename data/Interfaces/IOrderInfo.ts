export enum OrderStatusEnum {
  REGISTERING = 'REGISTERING',
  FINISHED = "FINISHED"
}

export default interface IOrderInfo {
  _id: string;
  customerId: string;
  branchId : string;
  promotionId?: number;
  status: OrderStatusEnum;
  createdAt: Date;
  deliveryTypeId? : number
  addressId? : number
  paymentMethodId? : number
}