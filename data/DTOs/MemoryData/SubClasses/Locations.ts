import AddressParser from "../../../../src/Shared/Parsers/AddressParser";
import { City, Country, State } from "../../BranchData";
import { LocationsPayload } from "../../LocationsPayload";

export default class Locations {
  public readonly countries : Array<Country>
  public readonly states : Array<State>
  public readonly cities : Array<City>

  constructor(locations : LocationsPayload) {
    this.countries = locations.countries
    this.states = locations.states
    this.cities = locations.cities
  }

  public GetCountryById(id : number) : Country {
    return this.countries.find((c : Country) => c.id === id)
  }

  public GetStatesByCountryId(countryId : number) : Array<State> {
    return this.states.filter((s : State) => s.countryId === countryId)
  }
  
  public GetCitiesByStateId(stateId : number) : Array<City> {
    return this.cities.filter((c : City) => c.stateId === stateId)
  }

  public GetCountryList() {
    return AddressParser.ParseCountriesToList(this.countries)
  }

  public GetStatesListByCountryId(countryId : number) {
    return AddressParser.ParseStatesToList(this.GetStatesByCountryId(countryId))
  }

  public GetCitieslistByStateId(stateId : number) {
    return AddressParser.ParseCitiesToList(this.GetCitiesByStateId(stateId))
  }
}