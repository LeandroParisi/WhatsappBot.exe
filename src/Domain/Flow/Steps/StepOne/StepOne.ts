import { Message } from "venom-bot";
import staticImplements from "../../../../Shared/Anotations/staticImplements";
import Client from "../../../Models/Client";
import IStep, { STEP_NUMBERS } from "../Interfaces/IStep";
import MainMenu from "../MainMenu/MainMenu";
import StepInfo from "../Messages/StepInfo";

@staticImplements<IStep>()
export default class StepOne {
  static STEP_NUMBER = STEP_NUMBERS.stepOne
  static STEP_NAME = "Boas Vindas"
  
  static Interact(client: Client, message : Message) : StepInfo {
    const messages = [
      `Olá ${client.shortName},\nMeu nome é ${'this.bot.Name'} e irei lhe auxiliar durante sua experiência de compra conosco, então, vamos lá?`, 
      MainMenu.INTRO_MESSAGE,
      MainMenu.MENU_OPTIONS,
    ]
    return new StepInfo (
      messages,
      STEP_NUMBERS.mainMenu
    )
  }
}