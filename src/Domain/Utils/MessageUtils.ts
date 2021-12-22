import staticImplements from "../../Shared/Anotations/staticImplements";

@staticImplements()
export default class MessageUtils {
  static FormatNumberOption(answer : string) {
    return Number(answer.trim())
  }


}
