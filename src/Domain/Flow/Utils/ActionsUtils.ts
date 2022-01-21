import Payload from "../StepActions/DTOs/Payload";
import { ActionsEnum } from "../StepActions/Interfaces/IActionHandler";
import StepInfo from "../Steps/Messages/StepInfo";

export default class ActionsUtils {
  static ExtractActions(step : StepInfo) : ActionsEnum[] {
    if (step.requiredAction && !!step.requiredAction.length) {
      return [...step.requiredAction]
    } else {
      return []
    }
  }

  static ExtractActionsPayload(step : StepInfo) : Payload[] {
    if (step.actionPayload && !!step.actionPayload.length) {
      return [...step.actionPayload]
    } else {
      return []
    }
  }
}