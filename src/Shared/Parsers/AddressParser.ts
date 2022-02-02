import { City, Country, State } from "../../../data/DTOs/BranchData";
import CustomerAddress from "../../../data/Models/CustomerAddress";

export default class AddressParser {
  public static ParseAddressToText(a : CustomerAddress) {
    return `${a.street}, ${a.streetNumber || "N/A"} - ${a.streetComplement || "N/A"} | ${a.neighborhood}, ${a.cityName}, ${a.stateName} - ${a.countryName}`
  }

  public static ParseCountriesToList(countries : Array<Country>) : string {
    return countries.map((country : Country, index : number) => `${index + 1}. ${country.countryName}`).join('\n')
  }

  public static ParseStatesToList(states : Array<State>) : string {
    return states.map((state : State, index : number) => `${index + 1}. ${state.stateName}`).join('\n')
  }

  public static ParseCitiesToList(cities : Array<City>) : string {
    return cities.map((city : City, index : number) => `${index + 1}. ${city.cityName}`).join('\n')
  }
}