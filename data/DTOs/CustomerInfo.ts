import CustomerAddress, { AddressStatusEnum, CurrentlyRegisteringAddress, CustomerAddressSQL } from "../Models/CustomerAddress"

export default interface CustomerInfo {
  whatsappNumber : string
  whatsappId : string
  email? : string
  firstName : string
  middleName? : string
  lastName? : string
  cpf? : string
  isActive : boolean
  customerAddresses : Array<CustomerAddress>
}

export interface ICustomerInfoSql {
  id? : string
  whatsappNumber : string
  whatsappId : string
  email? : string
  firstName : string
  middleName? : string
  lastName? : string
  cpf? : string
  isActive : boolean
  customerAddresses : Array<CustomerAddressSQL>
}

export class CustomerInfoSql implements ICustomerInfoSql {
  id?: string;
  whatsappNumber: string;
  whatsappId: string;
  email?: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  cpf?: string;
  isActive: boolean;
  customerAddresses: Array<CustomerAddressSQL>;

  /**
   *
   */
  constructor(customerInfo : ICustomerInfoSql) {
    this.id = customerInfo.id
    this.whatsappNumber = customerInfo.whatsappNumber
    this.whatsappId = customerInfo.whatsappId
    this.email = customerInfo.email
    this.firstName = customerInfo.firstName
    this.middleName = customerInfo.middleName
    this.lastName = customerInfo.lastName
    this.cpf = customerInfo.cpf
    this.isActive = customerInfo.isActive
    this.customerAddresses = customerInfo.customerAddresses
  }

  MapToMongo() : CustomerInfo {
    return {
      whatsappNumber: this.whatsappNumber,
      whatsappId: this.whatsappId,
      email: this.email,
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      cpf: this.cpf,
      isActive: this.isActive,
      customerAddresses: this.customerAddresses.map((c : CustomerAddressSQL) => ({
        _id: c.id,
        customerId: c.customerId,
        countryId: c.countryId ,
        countryName: c.countryName,
        stateId: c.stateId,
        stateName: c.stateName,
        cityId: c.cityId,
        cityName: c.cityName,
        neighborhood: c.neighborhood,
        street: c.street,
        streetNumber: c.streetNumber,
        streetComplement: c.streetComplement,
        postalCode: c.postalCode,
        isActive: c.isActive,
        status: AddressStatusEnum.NONE,
        currentlyRegistering: CurrentlyRegisteringAddress.NONE
      })),
    }
  }
}