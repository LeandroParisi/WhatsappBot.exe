import MainMenu from "../MainMenu/MainMenu";

export default class StepInfo {
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