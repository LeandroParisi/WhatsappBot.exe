import { Message } from "venom-bot";
import BranchData from "../../../../data/Interfaces/BranchData";
import Customer from "../../../Models/Customer"
import Order from "../../../Models/Order";
import { SessionData } from "../../Startup/BotStartUp";
import StepInfo from "../Messages/StepInfo";

export enum StepNumbers {
  welcomeStep = 1,
  promotionStep = 2.1,
  enrichOrderStep = 2.2,
  selectDeliveryType = 2.21,
  selectPaymentMethod = 2.22,
  selectAddress = 2.23,
  closingStep = 9,
  mainMenu = 10,
}

export const BUY_STEPS = new Set([StepNumbers.enrichOrderStep])

export default interface IStep {
  STEP_NUMBER : StepNumbers
  STEP_NAME : string

  Interact(
    client: Customer, 
    message : Message, 
    sessionData : SessionData,
    orderInfo? : Order
  ) : StepInfo
}