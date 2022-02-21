import AddressParser from "../../../../src/Shared/Parsers/AddressParser"
import GenericParser from "../../../../src/Shared/Parsers/GenericParser"
import { City, Country, State } from "../../BranchData"

export default class Locations {
  public readonly countries : Array<Country>
  public readonly states : Array<State>
  public readonly cities : Array<City>

  constructor(locations : Locations) {
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

  public ParseCountries() : string {
    return AddressParser.ParseCountriesToList(this.countries)
  }

  public ParseStatesByCountryId(countryId : number) : string {
    return AddressParser.ParseStatesToList(this.GetStatesByCountryId(countryId))
  }

  public ParseCitiesByStateId(stateId : number) : string {
    return AddressParser.ParseCitiesToList(this.GetCitiesByStateId(stateId))
  }

  public GetCountryByIndex(selectedIndex : number) : Country {
    return this.countries[selectedIndex]
  }

  public GetStateByIndex(countryId : number, selectedIndex : number) : State {
    return this.GetStatesByCountryId(countryId)[selectedIndex]
  }

  public GetCityByIndex(stateId : number, selectedIndex : number) : City {
    return this.GetCitiesByStateId(stateId)[selectedIndex]
  }

  public TryGetStateByCode(stateCode : string) : State {
    return this.states.find((s : State) => (
      GenericParser.ToUpperTrim(s.stateCode) === GenericParser.ToUpperTrim(stateCode)
    ))
  }

  public TryGetCityByName(cityName : string) : City {
    return this.cities.find((c : City) => (
      GenericParser.ToUpperTrim(c.cityName) === GenericParser.ToUpperTrim(cityName)
    ))
  }
}