import CustomerAddress from "../../../data/Interfaces/CustomerAddress";

export default class AddressUtils {
  public static ParseAddressToText(a : CustomerAddress) {
    return `${a.street}, ${a.streetNumber || "N/A"} - ${a.streetComplement || "N/A"} | ${a.neighborhood}, ${a.cityName}, ${a.stateName} - ${a.countryName}`
  }
}