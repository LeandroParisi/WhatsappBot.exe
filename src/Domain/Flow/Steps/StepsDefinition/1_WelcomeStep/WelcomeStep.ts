import { Message } from "venom-bot";
import BranchData from "../../../../../../data/Interfaces/BranchData";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../Models/Customer";
import IStep, { StepInteractionPayload, StepNumbers } from "../../Interfaces/IStep";
import MainMenu from "../10_MainMenu/MainMenu";
import StepInfo from "../../Messages/StepInfo";
import { SessionData } from "../../../Startup/BotStartUp";

@staticImplements<IStep>()
export default class WelcomeStep {
  static STEP_NUMBER = StepNumbers.welcomeStep
  static STEP_NAME = "Boas Vindas"
  
  static Interact({
    customer,
    sessionData: { branchData }
    } : StepInteractionPayload
    ) : StepInfo {
    const messages = [
      `Olá ${customer.info.firstName},\nMeu nome é ${branchData.botName} e irei lhe auxiliar durante sua experiência de compra conosco, então, vamos lá?`, 
      MainMenu.INTRO_MESSAGE,
      MainMenu.MENU_OPTIONS,
    ]
    return new StepInfo (
      messages,
      StepNumbers.mainMenu
    )
  }
}