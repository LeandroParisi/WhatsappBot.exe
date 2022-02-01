import { City, Country, State } from "./BranchData";

export interface LocationsPayload {
  countries: Array<Country>
  states: Array<State>
  cities: Array<City>
}