import AddressParser from "../../../src/Shared/Parsers/AddressParser";
import { City, Country, State } from "../BranchData";
import Locations from "./SubClasses/Locations";

export default class MemoryData {
  public readonly locations : Locations

  constructor(locations : Locations) {
    this.locations = new Locations(locations)
  }
}

