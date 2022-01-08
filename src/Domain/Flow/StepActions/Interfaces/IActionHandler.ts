import Customer from "../../../Models/Customer";

export enum ActionsEnum {
  SEND_ORDER = 'SEND_ORDER',
  REGISTER_ORDER = 'REGISTER_ORDER',
}

export default interface IActionHandler<PayloadType> {
  DispatchAction(payload : PayloadType, customer : Customer) : Promise<void>
}