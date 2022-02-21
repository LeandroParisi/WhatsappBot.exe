import Locations from "./SubClasses/Locations"

export default class MemoryData {
  public readonly locations : Locations

  constructor(locations : Locations) {
    this.locations = new Locations(locations)
  }
}

