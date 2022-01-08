import { Message } from "venom-bot";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../Models/Customer";
import IStep, {StepNumbers} from "../../Interfaces/IStep";
import MainMenu from "../10_MainMenu/MainMenu";
import StepInfo from "../../Messages/StepInfo";
import WelcomeStep from "../1_WelcomeStep/WelcomeStep";
import ClosingStep from "../9_ClosingStep/ClosingStep";
import PromotionsStep from "../2.1_PromotionsStep/PromotionsStep";

export default class StepFactory {
  static Create(currentStep : number) : IStep {
    if (!new Set([...Object.values(StepNumbers)]).has(currentStep)) {
      // TODO: enviar log de erro para o backend
      return UnidentifiedStep 
    }

    switch (currentStep) {
      case StepNumbers.welcomeStep:
        return WelcomeStep
      case StepNumbers.mainMenu:
        return MainMenu
      case StepNumbers.closingStep:
        return ClosingStep
      case StepNumbers.promotionStep:
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

  static Interact(client: Customer, message: Message) : StepInfo {
    return new StepInfo(
      ["Desculpe, não consegui interpretar sua última mensagem, poderia tentar novamente?"],
      StepNumbers.welcomeStep
    )
  }

}