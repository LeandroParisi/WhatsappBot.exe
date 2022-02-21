import staticImplements from "../../Shared/Anotations/staticImplements"
import AddressParser from "../../Shared/Parsers/AddressParser"
import CustomerAddress from "../../../data/Models/CustomerAddress"

@staticImplements()
export default class CustomerTemplateMessagesFactory {
  static GenerateAddressMessage(addresses : Array<CustomerAddress>) : string {
    return addresses.map((a: CustomerAddress, index : number) => {
      return `${index + 1}. ${AddressParser.ParseAddressToText(a)}`
    }).join('\n\n')
  }
}