import { City, Country, State } from "./BranchData";

export interface Locations {
  countries: Array<Country>
  states: Array<State>
  cities: Array<City>
}