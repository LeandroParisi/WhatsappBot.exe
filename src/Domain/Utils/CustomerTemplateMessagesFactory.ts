import CustomerAddress from "../../data/Interfaces/CustomerAddress";
import CustomerInfo from "../../data/Interfaces/CustomerInfo";
import staticImplements from "../../Shared/Anotations/staticImplements";
import AddressUtils from "../../Shared/Utils/AddressUtils";
import Customer from "../Models/Customer";

@staticImplements()
export default class CustomerTemplateMessagesFactory {
  static GenerateAddressMessage(addresses : Array<CustomerAddress>) : string {
    return addresses.map((a: CustomerAddress, index : number) => {
      return `${index + 1}. ${AddressUtils.ParseAddressToText(a)}`
    }).join('\n')
  }
}