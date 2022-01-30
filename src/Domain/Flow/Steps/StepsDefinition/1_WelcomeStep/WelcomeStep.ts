import { Message } from "venom-bot";
import BranchData from "../../../../../../data/Interfaces/BranchData";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../Models/Customer";
import IStep, { StepNumbers } from "../../Interfaces/IStep";
import MainMenu from "../10_MainMenu/MainMenu";
import StepInfo from "../../Messages/StepInfo";
import { SessionData } from "../../../Startup/BotCore";
import StepDefinition from "../../Interfaces/StepDefinition";
import Order from "../../../../Models/Order";
import CustomerAddress from "../../../../Models/CustomerAddress";

@staticImplements<IStep>()
export default class WelcomeStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.welcomeStep

  public Interact() : StepInfo {
    const messages = [
      `Olá ${this.Customer.info.firstName},\nMeu nome é ${this.SessionData.branchData.botName} e irei lhe auxiliar durante sua experiência de compra conosco, então, vamos lá?`, 
      MainMenu.INTRO_MESSAGE,
      MainMenu.MENU_OPTIONS,
    ]
    
    return new StepInfo (
      messages,
      StepNumbers.mainMenu
    )
  }
}