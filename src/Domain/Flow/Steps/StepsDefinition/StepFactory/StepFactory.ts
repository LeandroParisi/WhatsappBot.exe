import { Message } from "venom-bot";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Client from "../../../../Models/Client";
import IStep, {STEP_NUMBERS} from "../../Interfaces/IStep";
import MainMenu from "../10_MainMenu/MainMenu";
import StepInfo from "../../Messages/StepInfo";
import WelcomeStep from "../1_WelcomeStep/WelcomeStep";
import ClosingStep from "../9_ClosingStep/ClosingStep";
import PromotionsStep from "../2_PromotionsStep/PromotionsStep";

export default class StepFactory {
  static Create(currentStep : number) : IStep {
    if (!new Set([...Object.values(STEP_NUMBERS)]).has(currentStep)) {
      // TODO: enviar log de erro para o backend
      return UnidentifiedStep 
    }

    switch (currentStep) {
      case STEP_NUMBERS.welcomeStep:
        return WelcomeStep
      case STEP_NUMBERS.mainMenu:
        return MainMenu
      case STEP_NUMBERS.closingStep:
        return ClosingStep
      case STEP_NUMBERS.promotionStep:
        return PromotionsStep
      default:
        // TODO: enviar log de erro para o backend
        // TODO: Criar circuit breaker
        console.log("Current client step not mapped on stepFactory")
        return UnidentifiedStep 
    }
  }
}

@staticImplements<IStep>()
export class UnidentifiedStep {
  static STEP_NUMBER: -1;
  static STEP_NAME: "Unidentified Step";

  static Interact(client: Client, message: Message) : StepInfo {
    return new StepInfo(
      ["Desculpe, não consegui interpretar sua última mensagem, poderia tentar novamente?"],
      STEP_NUMBERS.welcomeStep
    )
  }

}