import ICustomerAddress, { AddressStatusEnum, CurrentlyRegistering } from "../../../data/Interfaces/ICustomerAddress";
import Payload from "../Flow/StepActions/DTOs/Payload";

export default class CustomerAddress implements ICustomerAddress, Payload {
  _id : string;
  id : number;
  customerId : string; 
  countryName : string;
  stateName : string;
  cityName : string;
  neighborhood : string;
  street : string;
  streetNumber : string;
  streetComplement : string;
  postalCode : string;
  isActive : boolean;
  status : AddressStatusEnum
  currentlyRegistering: CurrentlyRegistering

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
    this.id = null
    this.status = status
    this.customerId = customerId    
    this.countryName = "Brazil"
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