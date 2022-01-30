import { City, Country, State } from "../../../data/Interfaces/BranchData";
import ICustomerAddress from "../../../data/Interfaces/ICustomerAddress";

export default class AddressUtils {
  public static ParseAddressToText(a : ICustomerAddress) {
    return `${a.street}, ${a.streetNumber || "N/A"} - ${a.streetComplement || "N/A"} | ${a.neighborhood}, ${a.cityName}, ${a.stateName} - ${a.countryName}`
  }

  public static ExtractStatesByCountryId (locations: Array<Country>, countryId : number) : State[] {
    return locations
      .find((c : Country) => c.id === countryId)
      .countryStates
  }

  public static ExtractCitiesByCountryAndStateId (locations: Array<Country>, countryId : number, stateId : number) : City[] {
    return locations
      .find((c : Country) => c.id === countryId).countryStates
      .find((s : State) => s.id === stateId).stateCities
  }
}