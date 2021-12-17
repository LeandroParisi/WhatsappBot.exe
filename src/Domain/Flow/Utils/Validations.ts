import staticImplements from "../../../Shared/Anotations/staticImplements";

@staticImplements()
export default class Validations {
  public static IsNumber(stringToTest : string) : boolean {
    return /^[1-9]$/.test(stringToTest)
  }
}