import staticImplements from "../../../Shared/Anotations/staticImplements";

@staticImplements()
export default class Validations {
  public static IsNumber(stringToTest : string) : boolean {
    return /^[1-9]$/.test(stringToTest.trim())
  }

  public static IsInRange(stringToTest : string, aimedArray : Array<any>) {
    if (this.IsNumber(stringToTest)) {
      const arrayLength = aimedArray.length
      return Number(stringToTest) <= arrayLength
    } else {
      return false
    }
  }
}