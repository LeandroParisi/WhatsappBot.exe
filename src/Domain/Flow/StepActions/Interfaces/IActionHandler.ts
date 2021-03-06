import Customer from "../../../../Data/Models/Customer"
import { SessionData } from "../../Startup/BotCore"
import StepInfo from "../../Steps/Messages/StepInfo"

export enum ActionsEnum {
  SEND_ORDER = 'SEND_ORDER',
  REGISTER_ORDER = 'REGISTER_ORDER',
  UPDATE_ORDER = 'UPDATE_ORDER',
  UPSERT_ADDRESS = 'UPSERT_ADDRESS',
  SAVE_ADDRESS = 'SAVE_ADDRESS',
  CALCULATE_FARES = 'CALCULATE_FARES',
  VALIDATE_COUPOM = 'VALIDATE_COUPOM',
  CHECK_CUSTOMER_ORDERS = 'CHECK_CUSTOMER_ORDERS'
}

export default interface IActionHandler<PayloadType> {
  actionName : ActionsEnum
  
  DispatchAction(payload : PayloadType, customer? : Customer, sessionData? : SessionData) : Promise<void> | Promise<StepInfo>
}