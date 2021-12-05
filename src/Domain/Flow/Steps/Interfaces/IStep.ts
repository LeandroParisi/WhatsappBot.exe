import { Message } from "venom-bot";
import Client from "../../../Models/Client"
import StepInfo from "../Messages/StepInfo";

export const STEP_NUMBERS = {
  stepOne: 1,
  mainMenu: 10,
}

export default interface IStep {
  STEP_NUMBER : number
  STEP_NAME : string

  Interact(client: Client, message : Message) : StepInfo
}