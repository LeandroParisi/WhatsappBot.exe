import { Message } from "venom-bot";
import BranchData from "../../../../data/Interfaces/BranchData";
import Client from "../../../Models/Client"
import { SessionData } from "../../Startup/BotStartUp";
import StepInfo from "../Messages/StepInfo";

export const STEP_NUMBERS = {
  welcomeStep: 1,
  promotionStep: 2,
  closingStep: 9,
  mainMenu: 10,
}

export default interface IStep {
  STEP_NUMBER : number
  STEP_NAME : string

  Interact(client: Client, message : Message, sessionData : SessionData) : StepInfo
}