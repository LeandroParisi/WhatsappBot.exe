import MainMenu from "../StepsDefinition/10_MainMenu/MainMenu";
import IStepInfo from "./IStepInfo";

export default class StepInfo implements IStepInfo {
  outboundMessages: string[];
  nextStep: number;
  /**
   *
   */
  constructor(outboundMessages : string[], nextStep : number) {
    this.outboundMessages = outboundMessages
    this.nextStep = nextStep
  }
}