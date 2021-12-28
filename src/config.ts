import staticImplements from "./Shared/Anotations/staticImplements";
import { STEP_NUMBERS } from './Domain/Flow/Steps/Interfaces/IStep';

@staticImplements()
export default class Config {
  static onlineMenuUrl = "URL_CARDAPIO.com"
  static backendUrl = "http://localhost:3030/"
  static sessionResetRules = {
    currenStep: [STEP_NUMBERS.promotionStep, STEP_NUMBERS.closingStep],
    lastMessageInHours: 24
  }
}