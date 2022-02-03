import { Message } from "venom-bot";
import BranchData from "../../../../../../data/DTOs/BranchData";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../../../data/Models/Customer";
import IStep, { IStepOptions, StepNumbers } from "../../Interfaces/IStep";
import MainMenu from "../10_MainMenu/MainMenu";
import StepInfo from "../../Messages/StepInfo";
import { SessionData } from "../../../Startup/BotCore";
import StepDefinition, { StepDefinitionArgs } from "../../Interfaces/StepDefinition";
import Order from "../../../../../../data/Models/Order";
import CustomerAddress from "../../../../../../data/Models/CustomerAddress";

@staticImplements<IStep>()
@staticImplements<IStepOptions>()
export default class WelcomeStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.welcomeStep
  static ADDRESS_STEP = true
  static ORDER_STEP = true

  /**
   *
   */
  constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs);
    this.ADDRESS_STEP = WelcomeStep.ADDRESS_STEP
    this.ORDER_STEP = WelcomeStep.ORDER_STEP
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