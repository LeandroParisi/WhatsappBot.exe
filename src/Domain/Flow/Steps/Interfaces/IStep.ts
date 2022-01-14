import { Message } from "venom-bot";
import BranchData from "../../../../../data/Interfaces/BranchData";
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
  registerAddress = 3,
  confirmOrder = 8,
  closingStep = 9,
  mainMenu = 10,
}

export const BUY_STEPS = new Set([
  StepNumbers.enrichOrderStep,
  StepNumbers.selectDeliveryType,
  StepNumbers.selectPaymentMethod,
  StepNumbers.selectAddress,
  StepNumbers.registerAddress,
  StepNumbers.confirmOrder,
])

export interface StepInteractionPayload {
  customer: Customer, 
  message : Message, 
  sessionData : SessionData,
  orderInfo? : Order
}

export default interface IStep {
  STEP_NUMBER : StepNumbers

  Interact(paylod : StepInteractionPayload) : StepInfo
}