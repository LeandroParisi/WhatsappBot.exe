import staticImplements from "../../../Shared/Anotations/staticImplements";

@staticImplements()
export default class Validations {
  public static IsNumber(stringToTest : string) : boolean {
    return /^[1-9]$/.test(stringToTest.trim())
  }

  public static isInRange(stringToTest : string, aimedArray : Array<any>) {
    if (!this.IsNumber(stringToTest)) {
      return false
    } else {
      const optionIndex = Number(stringToTest) - 1
      const arrayLength = aimedArray.length
      return optionIndex >= arrayLength && optionIndex <= arrayLength 
    }
  }
}