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
}

interface DeliveryFees {
  fees: Array<any>,
  type: string,
}

interface OpeningHours {
  monday: HourInfo,
  thursday: HourInfo,
  wednesday: HourInfo,
  tuesday: HourInfo,
  friday: HourInfo,
  saturday: HourInfo,
  sunday: HourInfo,
}

interface HourInfo {
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