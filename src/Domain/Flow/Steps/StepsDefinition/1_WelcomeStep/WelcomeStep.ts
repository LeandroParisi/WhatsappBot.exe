import staticImplements from "../../../../../Shared/Anotations/staticImplements"
import IStep, { StepNumbers } from "../../Interfaces/IStep"
import MainMenu from "../10_MainMenu/MainMenu"
import StepInfo from "../../Messages/StepInfo"
import StepDefinition, { StepDefinitionArgs } from "../../Interfaces/StepDefinition"

@staticImplements<IStep>()
export default class WelcomeStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.welcomeStep

  /**
   *
   */
  constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs)
  }

  public async Interact() : Promise<StepInfo> {
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