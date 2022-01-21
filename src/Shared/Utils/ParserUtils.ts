export default class ParserUtils {
  public static ToNumber(string : string) {
    return Number(string.trim())
  }

  public static ToUpperTrim(string : string) {
    return string.trim().toUpperCase()
  }
}