import ICustomerAddress, { AddressStatusEnum, CurrentlyRegisteringAddress } from "../../../data/Interfaces/ICustomerAddress";
import Payload from "../Flow/StepActions/DTOs/Payload";
import { v4 as uuid } from "uuid";


export default class CustomerAddress implements ICustomerAddress, Payload {
  _id : string;
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
    this.stateName = stateName
    this.cityName = cityName
    this.neighborhood = neighborhood
    this.street = street
    this.streetNumber = streetNumber
    this.streetComplement = streetComplement
    this.postalCode = postalCode
    this.isActive = isActive
  }

  public MapToSql() : CustomerAddressSQL {
    return new CustomerAddressSQL(this)
  }
}

export class CustomerAddressSQL implements ICustomerAddress {
  id : string;
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

  constructor (
    address : CustomerAddress
    ) {
    this.id = address._id
    this.customerId = address.customerId    
    this.countryName = address.countryName
    this.stateName = address.stateName
    this.cityName = address.cityName
    this.neighborhood = address.neighborhood
    this.street = address.street
    this.streetNumber = address.streetNumber
    this.streetComplement = address.streetComplement
    this.postalCode = address.postalCode
    this.isActive = address.isActive
  }

  public MapToMongo() : CustomerAddress {
    const customer = new CustomerAddress(AddressStatusEnum.FINISHED, this.customerId)
    customer._id = this.id
    customer.customerId = this.customerId
    customer.countryName = this.countryName
    customer.stateName = this.stateName
    customer.cityName = this.cityName
    customer.neighborhood = this.neighborhood
    customer.street = this.street
    customer.streetNumber = this.streetNumber
    customer.streetComplement = this.streetComplement
    customer.postalCode = this.postalCode
    customer.isActive = this.isActive
    return customer
  }
}