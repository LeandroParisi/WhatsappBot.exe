import { Message } from "venom-bot";
import Customer from "../../../Models/Customer";
import CustomerAddress from "../../../Models/CustomerAddress";
import Order from "../../../Models/Order";
import { SessionData } from "../../Startup/BotStartUp";
import StepInfo from "../Messages/StepInfo";

export interface StepDefinitionArgs {
  customer: Customer, 
  message : Message, 
  sessionData : SessionData,
  orderInfo? : Order
  address? : CustomerAddress
}

export default abstract class StepDefinition {
  Customer: Customer;
  Message: Message;
  SessionData: SessionData;
  Answer : string;
  OrderInfo?: Order;
  Address?: CustomerAddress;

  constructor({ customer , message , sessionData , orderInfo , address } : StepDefinitionArgs) {
    this.Customer = customer
    this.Message = message
    this.SessionData = sessionData
    this.Answer = message.body
    this.OrderInfo = orderInfo
    this.Address = address
  }

  abstract Interact() : StepInfo
}