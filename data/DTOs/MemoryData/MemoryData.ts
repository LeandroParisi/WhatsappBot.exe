import AddressParser from "../../../src/Shared/Parsers/AddressParser";
import { City, Country, State } from "../BranchData";
import { LocationsPayload } from "../LocationsPayload";
import Locations from "./SubClasses/Locations";

export default class MemoryData {
  public readonly locations : Locations

  constructor(locations : LocationsPayload) {
    this.locations = new Locations(locations)
  }
}

