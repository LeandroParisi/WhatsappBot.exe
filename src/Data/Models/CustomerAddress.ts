import { v4 as uuid } from "uuid"
import Payload from "../../Domain/Flow/StepActions/DTOs/Base/Payload"

export enum AddressStatusEnum {
  REGISTERING,
  FINISHED,
  NONE
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
  NONE = 0,
}

export default class CustomerAddress implements Payload {
  _id : string;
  customerId : string;
  countryId : number 
  countryName : string;
  stateId : number
  stateName : string;
  cityId : number
  cityName : string;
  neighborhood : string;
  street : string;
  streetNumber : string;
  streetComplement : string;
  postalCode : string;
  isActive : boolean;
  status : AddressStatusEnum
  currentlyRegistering: CurrentlyRegisteringAddress

  constructor(
    status : AddressStatusEnum,
    customerId : string, 
    stateName? : string,
    cityName? : string,
    neighborhood? : string,
    street? : string,
    streetNumber? : string,
    streetComplement? : string,
    postalCode? : string,
    isActive? : boolean,
    ) {
    this._id = uuid()
    this.status = status
    this.customerId = customerId    
    this.countryName = "Brazil"
    this.countryId = 1
    this.stateName = stateName
    this.cityName = cityName
    this.neighborhood = neighborhood
    this.street = street
    this.streetNumber = streetNumber
    this.streetComplement = streetComplement
    this.postalCode = postalCode
    this.isActive = isActive
  }
}

export class CustomerAddressSQL {
  id : string;
  customerId : string; 
  countryId : number;
  countryName : string;
  stateId : number;
  stateName : string;
  cityId : number;
  cityName : string;
  neighborhood : string;
  street : string;
  streetNumber : string;
  streetComplement : string;
  postalCode : string;
  isActive : boolean;

  constructor (
    address : CustomerAddress
    ) {
    this.id = address._id
    this.customerId = address.customerId    
    this.countryId = address.countryId
    this.countryName = address.countryName
    this.stateId = address.stateId
    this.stateName = address.stateName
    this.cityId = address.cityId
    this.cityName = address.cityName
    this.neighborhood = address.neighborhood
    this.street = address.street
    this.streetNumber = address.streetNumber
    this.streetComplement = address.streetComplement
    this.postalCode = address.postalCode
    this.isActive = address.isActive
  }
}