import { Message } from "venom-bot";
import staticImplements from "../../../../Shared/Anotations/staticImplements";
import Client from "../../../Models/Client";
import IStep, {STEP_NUMBERS} from "../Interfaces/IStep";
import MainMenu from "../MainMenu/MainMenu";
import StepInfo from "../Messages/StepInfo";
import StepOne from "../StepOne/StepOne";

export default class StepFactory {
  static Create(currentStep : number) : IStep {
    if (!new Set([...Object.values(STEP_NUMBERS)]).has(currentStep)) {
      // TODO: enviar log de erro para o backend
      return UnidentifiedStep 
    }

    switch (currentStep) {
      case 1:
        return StepOne
      case 10:
        return MainMenu
        
      default:
        // TODO: enviar log de erro para o backend
        console.log("Current client step not mapped on stepFactory")
        return UnidentifiedStep 
    }
  }
}

@staticImplements<IStep>()
class UnidentifiedStep {
  static STEP_NUMBER: -1;
  static STEP_NAME: "Unidentified Step";

  static Interact(client: Client, message: Message) : StepInfo {
    return new StepInfo(
      ["Desculpe, não consegui interpretar sua última mensagem, poderia tentar novamaente?"],
      STEP_NUMBERS.stepOne
    )
  }

}