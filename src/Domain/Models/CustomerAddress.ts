import ICustomerAddress from "../../../data/Interfaces/ICustomerAddress";

export enum AddressStatusEnum {
  REGISTERING,
  FINISHED
}

export default class CustomerAddress implements ICustomerAddress {
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

  constructor() {
    this.id = null
    this.countryName = 'Brasil'
  }
}