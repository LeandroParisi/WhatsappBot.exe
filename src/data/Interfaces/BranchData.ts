export default interface BranchData {
  id : string,
  whatsappNumber : string,
  whatsappId? : string,
  managerName : string,
  branchName : string,
  neighborhood : string,
  street : string,
  streetNumber : string,
  streetComplement : string,
  postalCode : string,
  deliveryFees : DeliveryFees
  logo : string,
  createdAt : string,
  updatedAt : string,
  countryName : string,
  stateName : string,
  cityName : string,
  openingHours : OpeningHours,
  paymentMethods : Array<PaymentMethod>,
  deliveryTypes : Array<DeliveryType>,
  promotions : Array<Promotion>
  botName : string,
  formattedPromotions : string
}

interface DeliveryFees {
  fees: Array<any>,
  type: string,
}

export interface OpeningHours {
  monday: HourInfo,
  thursday: HourInfo,
  wednesday: HourInfo,
  tuesday: HourInfo,
  friday: HourInfo,
  saturday: HourInfo,
  sunday: HourInfo,
}

export interface HourInfo {
  hours: Array<string>,
  isOpened: boolean,
  overnight: boolean,
}

interface PaymentMethod {
  id: number,
  paymentMethod: string
}

interface DeliveryType {
  id: number,
  deliveryType: string
}

export interface Promotion {
  id: number,
  name: string,
  totalPrice: string,
  dueDate: string,
  avaiability: Array<number>,
  isActive: boolean,
  image?: string,
  promotionProducts: Array<Product>,
}

export interface Product {
  productId: string,
  name: string,
  attributes: Array<Attribute>
}

export interface Attribute {
  id: string,
  name: string,
  type: string,
  price: number,
  quantity: number
}

export enum AttributeTypes {
  sizes = 'sizes',
  additionals =  'additionals',
}