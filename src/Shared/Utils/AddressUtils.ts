import ICustomerAddress from "../../../data/Interfaces/ICustomerAddress";

export default class AddressUtils {
  public static ParseAddressToText(a : ICustomerAddress) {
    return `${a.street}, ${a.streetNumber || "N/A"} - ${a.streetComplement || "N/A"} | ${a.neighborhood}, ${a.cityName}, ${a.stateName} - ${a.countryName}`
  }
}