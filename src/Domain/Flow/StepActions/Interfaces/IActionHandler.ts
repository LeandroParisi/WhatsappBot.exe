import BranchData from "../../../../../data/DTOs/BranchData";
import Customer from "../../../../../data/Models/Customer";
import StepInfo from "../../Steps/Messages/StepInfo";

export enum ActionsEnum {
  SEND_ORDER = 'SEND_ORDER',
  REGISTER_ORDER = 'REGISTER_ORDER',
  UPDATE_ORDER = 'UPDATE_ORDER',
  UPSERT_ADDRESS = 'UPSERT_ADDRESS',
  SAVE_ADDRESS = 'SAVE_ADDRESS',
  CALCULATE_FARES = 'CALCULATE_FARES'
}

export default interface IActionHandler<PayloadType> {
  actionName : ActionsEnum
  
  DispatchAction(payload : PayloadType, customer? : Customer, branchData? : BranchData) : Promise<void> | Promise<StepInfo>
}