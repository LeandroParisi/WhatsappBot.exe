import Client from "../../../Models/Client";

export enum StepActionEnum {
  BUY_PROMOTION = 'BUY_PROMOTION'
}

export interface IStepAction<PayloadType> {
  DispatchAction(payload : PayloadType, client : Client) : Promise<string>
}