export enum AddressStatusEnum {
  REGISTERING,
  FINISHED
}

export enum CurrentlyRegisteringAddress {
  COUNTRY_NAME = 1,
  STATE_NAME = 2,
  CITY_NAME = 3,
  NEIGHBORHOOD = 4,
  STREET = 5,
  STREET_NUMBER = 6,
  STREET_COMPLEMENT = 7,
  POSTAL_CODE = 8,
}

export default interface ICustomerAddress {
  id : number
  countryName : string
  stateName : string
  cityName : string
  neighborhood : string
  street : string
  streetNumber : string
  streetComplement : string
  postalCode : string
  isActive : boolean
  currentlyRegistering : CurrentlyRegisteringAddress
}