import Payload from "../../StepActions/DTOs/Payload";
import { StepActionEnum } from "../../StepActions/Interfaces/IStepAction";
import IStepInfo from "./IStepInfo";


export default class StepInfo implements IStepInfo {
  outboundMessages: string[];
  nextStep: number;
  requiredAction: StepActionEnum
  actionPayload: Payload
  /**
   *
   */
  constructor(
    outboundMessages : string[],
    nextStep : number,
    requiredAction? : StepActionEnum,
    actionPayload? : Payload
  ) {
    this.outboundMessages = outboundMessages
    this.nextStep = nextStep
    this.requiredAction = requiredAction
    this.actionPayload = actionPayload
  }
}