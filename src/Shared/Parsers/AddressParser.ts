import { City, Country, State } from "../../../data/DTOs/BranchData";
import ICustomerAddress from "../../../data/Interfaces/ICustomerAddress";

export default class AddressParser {
  public static ParseAddressToText(a : ICustomerAddress) {
    return `${a.street}, ${a.streetNumber || "N/A"} - ${a.streetComplement || "N/A"} | ${a.neighborhood}, ${a.cityName}, ${a.stateName} - ${a.countryName}`
  }

  public static GetStatesList(states : Array<State>) {
    return states.map((state : State, index : number) => `${index + 1}. ${state.stateName}`).join('\n')
  }
}