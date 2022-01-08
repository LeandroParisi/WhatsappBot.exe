import staticImplements from "./Shared/Anotations/staticImplements";
import { StepNumbers } from './Domain/Flow/Steps/Interfaces/IStep';

@staticImplements()
export default class Config {
  static onlineMenuUrl = "URL_CARDAPIO.com"
  static backendUrl = "http://localhost:3030/"
  static sessionResetRules = {
    currenStep: [StepNumbers.promotionStep, StepNumbers.closingStep],
    lastMessageInHours: 24
  }
}