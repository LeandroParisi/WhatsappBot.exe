import staticImplements from "../../../../../../Shared/Anotations/staticImplements"
import IStep, { StepNumbers } from "../../../Interfaces/IStep"
import StepDefinition, { StepDefinitionArgs } from "../../../Interfaces/StepDefinition"
import StepInfo from "../../../Messages/StepInfo"


// @staticImplements<IStep>()
export default class SelectCoupomStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.welcomeStep

  /**
   *
   */
  constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs);
  }

  public async Interact() : Promise<StepInfo> {
    throw new Error()
  }
}