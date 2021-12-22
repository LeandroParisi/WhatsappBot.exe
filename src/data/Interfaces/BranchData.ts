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
  templateMessages : TemplateMessages
}

export interface DeliveryFees {
  fees: DeliveryFeeType,
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

export interface PaymentMethod {
  id: number,
  paymentMethod: PaymentMethodsEnum
}

export interface DeliveryType {
  id: number,
  deliveryType: DeliveryTypesEnum
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

export interface TemplateMessages {
  promotionsInformation : PromotionsInformation
  openingHours : string
  deliveryInformation : string
  paymentMethods : string
}

export interface PromotionsInformation {
  message : string
  hasPromotions : boolean
  avaiablePromotions : number
}

export interface DayInfo {
  hours: string[],
  isOpened: boolean,
  overnight: boolean
}

export enum AttributeTypes {
  sizes = 'sizes',
  additionals =  'additionals',
}

export enum DeliveryFeeTypesEnum {
    UNIQUE = 'unique',
    RADIUS = 'radius',
    // neighborhood: 'neighborhood',
}

export enum DeliveryTypesEnum {
  DELIVERY = 'delivery',
  COUNTER_PICKUP = 'counter_pickup',
  ON_SPOT_CONSUMPTION = 'on_spot_consumption',
}

export enum PaymentMethodsEnum {
  MONEY = 'money',
  PIX = 'pix',
  CREDIT = 'credit',
  DEBIT = 'debit',
  ALELO_MEAL = 'alelo_meal',
  ALELO_FOOD = 'alelo_food',
  SODEXO_MEAL = 'sodexo_meal',
  SODEXO_FOOD = 'sodexo_food',
}

export type DeliveryFeeType = number | Array<Array<number>>
  
