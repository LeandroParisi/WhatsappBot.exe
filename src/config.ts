import staticImplements from "./Shared/Anotations/staticImplements";
// TODO: ajustar essa bagaça
import { StepNumbers } from './Domain/Flow/Steps/Interfaces/IStep';
import SystemUtils from "./Shared/Utils/SystemUtils";


@staticImplements()
export default class Config {
  static onlineMenuUrl = "URL_CARDAPIO.com"
  static backendUrl = "http://localhost:3030/"


  static sessionResetRules = {
    stepsToReset: SystemUtils.GetEnumNumberValues(StepNumbers).filter(n => n >= 2 && n < 10),
    lastMessageInHours: 24
  }
}