import staticImplements from "../../../../../Shared/Anotations/staticImplements"
import IStep, { StepNumbers } from "../../Interfaces/IStep"
import StepInfo from "../../Messages/StepInfo"
import StepDefinition from "../../Interfaces/StepDefinition"

@staticImplements<IStep>()
export default class CheckOrders extends StepDefinition {
  static STEP_NUMBER = StepNumbers.checkOrders

  public async Interact() : Promise<StepInfo> {
    throw new Error()
  }
}