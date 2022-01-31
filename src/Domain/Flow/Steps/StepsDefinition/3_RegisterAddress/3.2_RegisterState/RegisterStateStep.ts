import staticImplements from "../../../../../../Shared/Anotations/staticImplements";
import IStep, { StepNumbers } from "../../../Interfaces/IStep";
import StepDefinition from "../../../Interfaces/StepDefinition";
import StepInfo from "../../../Messages/StepInfo";

@staticImplements<IStep>()
export default class RegisterStateStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.registerState
  
  public async Interact(): Promise<StepInfo> {
    throw new Error("Method not implemented.");
  }
}