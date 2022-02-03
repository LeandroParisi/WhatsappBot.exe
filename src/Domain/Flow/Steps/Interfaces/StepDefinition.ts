import { Message } from "venom-bot";
import Customer from "../../../../../data/Models/Customer";
import CustomerAddress from "../../../../../data/Models/CustomerAddress";
import Order from "../../../../../data/Models/Order";
import { SessionData } from "../../Startup/BotCore";
import StepInfo from "../Messages/StepInfo";
import IStep, { IStepOptions, StepNumbers } from "./IStep";

export interface StepDefinitionArgs {
  customer: Customer, 
  message : Message, 
  sessionData : SessionData,
  orderInfo? : Order
  address? : CustomerAddress
}

export default abstract class StepDefinition implements IStepOptions {
  Customer: Customer;
  Message: Message;
  SessionData: SessionData;
  Answer : string;
  OrderInfo?: Order;
  Address?: CustomerAddress;
  ADDRESS_STEP: boolean;
  ORDER_STEP: boolean;

  constructor({ customer , message , sessionData , orderInfo , address } : StepDefinitionArgs) {
    this.Customer = customer
    this.Message = message
    this.SessionData = sessionData
    this.Answer = message.body
    this.OrderInfo = orderInfo
    this.Address = address
    this.ADDRESS_STEP = false
    this.ORDER_STEP = false
  }


  async Interact() : Promise<StepInfo> {
    throw new Error("Mot implemented")
  }
}