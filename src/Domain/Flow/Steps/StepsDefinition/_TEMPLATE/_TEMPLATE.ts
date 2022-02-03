import { Message } from "venom-bot";
import BranchData from "../../../../../../data/DTOs/BranchData";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../../../data/Models/Customer";
import IStep, { StepNumbers } from "../../Interfaces/IStep";
import MainMenu from "../10_MainMenu/MainMenu";
import StepInfo from "../../Messages/StepInfo";
import { SessionData } from "../../../Startup/BotCore";
import StepDefinition from "../../Interfaces/StepDefinition";
import Order from "../../../../../../data/Models/Order";
import CustomerAddress from "../../../../../../data/Models/CustomerAddress";

@staticImplements<IStep>()
export default class TEMPLATE extends StepDefinition {
  static STEP_NUMBER = StepNumbers.welcomeStep

  public async Interact() : Promise<StepInfo> {
    throw new Error()
  }
}