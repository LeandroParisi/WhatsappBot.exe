export enum AddressStatusEnum {
  REGISTERING,
  FINISHED
}

export enum CurrentlyRegistering {
  COUNTRY_NAME,
  STATE_NAME,
  CITY_NAME,
  NEIGHBORHOOD,
  STREET,
  STREET_NUMBER,
  STREET_COMPLEMENT,
  POSTAL_CODE,
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
  currentlyRegistering : CurrentlyRegistering
}