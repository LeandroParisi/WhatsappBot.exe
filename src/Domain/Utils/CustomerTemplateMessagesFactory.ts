import CustomerAddress from "../../data/Interfaces/CustomerAddress";
import CustomerInfo from "../../data/Interfaces/CustomerInfo";
import staticImplements from "../../Shared/Anotations/staticImplements";
import Address from "../Models/Address";
import Customer from "../Models/Customer";

@staticImplements()
export default class CustomerTemplateMessagesFactory {
  static GenerateAddressMessage(addresses : Array<CustomerAddress>) : string {
    return addresses.map((a: CustomerAddress, index : number) => {
      return `${index + 1}. ${a.street}, ${a.streetNumber || "N/A"} - ${a.streetComplement || "N/A"} | ${a.neighborhood}, ${a.cityName}, ${a.stateName} - ${a.countryName}`
    }).join('\n')
  }
}