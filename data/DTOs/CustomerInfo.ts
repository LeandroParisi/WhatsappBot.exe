import CustomerAddress from "../Models/CustomerAddress";

export default interface CustomerInfo {
  id : string
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