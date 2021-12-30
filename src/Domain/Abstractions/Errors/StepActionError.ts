import { StepActionEnum } from "../../Flow/StepActions/Interfaces/IStepAction";

export default class StepActionError extends Error {
  action: StepActionEnum;
  originalError: any;

  constructor (action : StepActionEnum, message : string, error? : any) {
    super();
    this.action = action,
    this.message = message
    this.originalError = error 
  }
}