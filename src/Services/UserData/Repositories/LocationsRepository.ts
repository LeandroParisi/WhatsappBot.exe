import Datastore = require("nedb-promises");
import { Service } from "typedi"
import { City, Country, State } from "../../../../data/DTOs/BranchData"
import { Locations } from "../../../../data/DTOs/Locations"
import LocationsDb from '../locationsDataConfig'

@Service()
export default class LocationsRepository {
  constructor(
    private readonly LocationsDb : LocationsDb,
  ) {
  }

  async CleanUp() : Promise<void> {
    await this.LocationsDb.citiesDb.remove({}, { multi: true })
    await this.LocationsDb.countriesDb.remove({}, { multi: true })
    await this.LocationsDb.statesDb.remove({}, { multi: true })
  }

  async InsertLocations(locations : Locations) : Promise<void> {
    const { countries, states, cities } = locations
    await this.LocationsDb.citiesDb.insert(cities)
    await this.LocationsDb.countriesDb.insert(countries)
    await this.LocationsDb.statesDb.insert(states)

  }

  async GetCountryById(id : number) : Promise<Country> {
    return await this.LocationsDb.countriesDb.findOne({ id }) as Country
  }

  async GetStateByCountryId(countryId : number) : Promise<Array<State>> {
    return await this.LocationsDb.statesDb.find({ countryId })

  }
  
  async GetCityByStateId(stateId : number) : Promise<Array<City>> {
    return await this.LocationsDb.citiesDb.find({ stateId })
  }
  // async GetCityById(countryId : number, stateId : number, id : number)
}

