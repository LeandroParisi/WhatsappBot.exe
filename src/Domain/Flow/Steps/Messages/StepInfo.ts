import Payload from "../../StepActions/DTOs/Payload";
import { ActionsEnum } from "../../StepActions/Interfaces/IActionHandler";
import IStepInfo from "./IStepInfo";


export default class StepInfo implements IStepInfo {
  outboundMessages: string[];
  nextStep: number;
  requiredAction: ActionsEnum
  actionPayload: Payload
  /**
   *
   */
  constructor(
    outboundMessages : string[],
    nextStep : number,
    requiredAction? : ActionsEnum,
    actionPayload? : Payload
  ) {
    this.outboundMessages = outboundMessages
    this.nextStep = nextStep
    this.requiredAction = requiredAction
    this.actionPayload = actionPayload
  }
}