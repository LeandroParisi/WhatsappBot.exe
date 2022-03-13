import { City, Country, State } from "../../Data/DTOs/BranchData"
import staticImplements from "../../Shared/Anotations/staticImplements"

@staticImplements()
export default class LocationsTemplateMessageFactory {
  static GenerateCountriesMessage(countries : Array<Country>) : string {
    return countries.map((c: Country, index : number) => {
      return `${index + 1}. ${c.countryName}`
    }).join('\n')
  }

  static GenerateStatesMessage(states : Array<State>) : string {
    return states.map((s: State, index : number) => {
      return `${index + 1}. ${s.stateName}`
    }).join('\n')
  }

  static GenerateCitiesMessage(cities : Array<City>) : string {
    return cities.map((c: City, index : number) => {
      return `${index + 1}. ${c.cityName}`
    }).join('\n')
  }
}