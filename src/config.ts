import staticImplements from "./Shared/Anotations/staticImplements";
import { ADDRESS_STEPS, BUY_STEPS, StepNumbers } from './Domain/Flow/Steps/Interfaces/IStep';

@staticImplements()
export default class Config {
  static onlineMenuUrl = "URL_CARDAPIO.com"
  static backendUrl = "http://localhost:3030/"
  static sessionResetRules = {
    currentStep: [
      StepNumbers.promotionStep,
      StepNumbers.closingStep,
      ...Array.from(BUY_STEPS),
      ...Array.from(ADDRESS_STEPS)
    ],
    lastMessageInHours: 24
  }
}