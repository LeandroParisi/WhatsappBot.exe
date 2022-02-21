import staticImplements from "../../../../../Shared/Anotations/staticImplements"
import IStep, { StepNumbers } from "../../Interfaces/IStep"
import StepInfo from "../../Messages/StepInfo"
import StepDefinition from "../../Interfaces/StepDefinition"

@staticImplements<IStep>()
export default class TEMPLATE extends StepDefinition {
  static STEP_NUMBER = StepNumbers.welcomeStep

  public async Interact() : Promise<StepInfo> {
    throw new Error()
  }
}