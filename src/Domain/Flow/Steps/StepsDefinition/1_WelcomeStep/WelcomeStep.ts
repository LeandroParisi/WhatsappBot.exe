import { Message } from "venom-bot";
import BranchData from "../../../../../data/Interfaces/BranchData";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Client from "../../../../Models/Client";
import IStep, { STEP_NUMBERS } from "../../Interfaces/IStep";
import MainMenu from "../10_MainMenu/MainMenu";
import StepInfo from "../../Messages/StepInfo";

@staticImplements<IStep>()
export default class WelcomeStep {
  static STEP_NUMBER = STEP_NUMBERS.welcomeStep
  static STEP_NAME = "Boas Vindas"
  
  static Interact(client: Client, message : Message, branchData : BranchData) : StepInfo {
    const messages = [
      `Olá ${client.shortName},\nMeu nome é ${branchData.botName} e irei lhe auxiliar durante sua experiência de compra conosco, então, vamos lá?`, 
      MainMenu.INTRO_MESSAGE,
      MainMenu.MENU_OPTIONS,
    ]
    return new StepInfo (
      messages,
      STEP_NUMBERS.mainMenu
    )
  }
}