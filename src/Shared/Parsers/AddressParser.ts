import { City, Country, State } from "../../../data/DTOs/BranchData";
import ICustomerAddress from "../../../data/Interfaces/ICustomerAddress";

export default class AddressParser {
  public static ParseAddressToText(a : ICustomerAddress) {
    return `${a.street}, ${a.streetNumber || "N/A"} - ${a.streetComplement || "N/A"} | ${a.neighborhood}, ${a.cityName}, ${a.stateName} - ${a.countryName}`
  }

  public static ParseCountriesToList(countries : Array<Country>) {
    return countries.map((country : Country, index : number) => `${index + 1}. ${country.countryName}`).join('\n')
  }

  public static ParseStatesToList(states : Array<State>) {
    return states.map((state : State, index : number) => `${index + 1}. ${state.stateName}`).join('\n')
  }

  public static ParseCitiesToList(cities : Array<City>) {
    return cities.map((city : City, index : number) => `${index + 1}. ${city.cityName}`).join('\n')
  }
}