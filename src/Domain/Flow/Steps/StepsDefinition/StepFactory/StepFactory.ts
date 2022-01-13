import { Message } from "venom-bot";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../Models/Customer";
import IStep, {StepNumbers} from "../../Interfaces/IStep";
import MainMenu from "../10_MainMenu/MainMenu";
import StepInfo from "../../Messages/StepInfo";
import WelcomeStep from "../1_WelcomeStep/WelcomeStep";
import ClosingStep from "../9_ClosingStep/ClosingStep";
import PromotionsStep from "../2.1_PromotionsStep/PromotionsStep";
import { Dictionary } from "../../../../../Shared/Utils/SystemUtils";

@staticImplements()
export default class StepFactory {

  private static StepWarehouse : Dictionary<IStep> = {}

  static Create(currentStep : number) : IStep {
    try {
      return this.StepWarehouse[currentStep]
    } catch {
      throw new Error("Unregistered Step type and number")
    }
  }

  public static RegisterStep(step : IStep) {
    console.log(this.StepWarehouse)
    this.StepWarehouse[step.STEP_NUMBER] = step
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