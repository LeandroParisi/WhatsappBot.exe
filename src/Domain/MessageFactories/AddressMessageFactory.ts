import staticImplements from "../../Shared/Anotations/staticImplements"
import CustomerAddress, { CurrentlyRegisteringAddress } from "../../Data/Models/CustomerAddress"

@staticImplements()
export default class AddressMessageFactory {


  static GenerateAddressConfirmationMessage(address : CustomerAddress) {
    return `
      ${CurrentlyRegisteringAddress.COUNTRY_NAME}. *País*: ${address.countryName}\n
      ${CurrentlyRegisteringAddress.STATE_NAME}. *Estado*: ${address.stateName}\n
      ${CurrentlyRegisteringAddress.CITY_NAME}. *Cidade*: ${address.cityName}\n
      ${CurrentlyRegisteringAddress.NEIGHBORHOOD}. *Bairro*: ${address.neighborhood}\n
      ${CurrentlyRegisteringAddress.STREET}. *Rua*: ${address.street}\n
      ${CurrentlyRegisteringAddress.STREET_NUMBER}. *Número*: ${address.streetNumber}\n
      ${CurrentlyRegisteringAddress.STREET_COMPLEMENT}. *Complemento*: ${address.streetComplement}\n
      ${CurrentlyRegisteringAddress.POSTAL_CODE}. *CEP*: ${address.postalCode}
    `
  }
}
