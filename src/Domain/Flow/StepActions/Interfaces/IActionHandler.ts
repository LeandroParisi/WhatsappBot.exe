import Customer from "../../../Models/Customer";

export enum ActionsEnum {
  SEND_ORDER = 'SEND_ORDER',
  REGISTER_ORDER = 'REGISTER_ORDER',
  UPDATE_ORDER = 'UPDATE_ORDER'
}

export default interface IActionHandler<PayloadType> {
  actionName : ActionsEnum
  
  DispatchAction(payload : PayloadType, customer : Customer) : Promise<void>
}