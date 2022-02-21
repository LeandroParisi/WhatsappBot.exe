import staticImplements from "../../../../../Shared/Anotations/staticImplements"
import IStep, { StepNumbers} from "../../Interfaces/IStep"
import StepInfo from "../../Messages/StepInfo"
import { Dictionary } from "../../../../../Shared/Utils/SystemUtils"
import StepDefinition, { StepDefinitionArgs } from "../../Interfaces/StepDefinition"

@staticImplements()
export default class StepFactory {

  private static StepWarehouse : Dictionary<any> = {}

  static Create(currentStep : number, stepPayload : StepDefinitionArgs) : StepDefinition {
    try {
      return new this.StepWarehouse[currentStep](stepPayload)
    } catch {
      throw new Error("Unregistered Step type and number")
    }
  }

  public static RegisterStep(step : IStep) {
    this.StepWarehouse[step.STEP_NUMBER] = step
  }
}

export class UnidentifiedStep {
  static STEP_NUMBER: -1;
  static STEP_NAME: "Unidentified Step";

  static Interact({} : StepDefinitionArgs) : StepInfo {
    return new StepInfo(
      ["Desculpe, não consegui interpretar sua última mensagem, poderia tentar novamente?"],
      StepNumbers.welcomeStep
    )
  }

}