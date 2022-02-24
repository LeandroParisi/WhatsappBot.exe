import Customer from "../../../../../../data/Models/Customer"
import { StepNumbers } from "../../Interfaces/IStep"
import StepInfo from "../../Messages/StepInfo"
import MainMenu from "../10_MainMenu/MainMenu"

interface options {
  prefixMessages? : string[],
  sufixMessages? : string[]
}
export default class ReturnToMenu {
  static GenerateMessage(
    { 
      prefixMessages = [],
      sufixMessages = [] 
    } : options,
    customer : Customer
    ) : StepInfo {
    
    return new StepInfo(
      [
        ...prefixMessages,
        `Perfeito! Me diga então qual informação deseja (digite o número da opção para darmos continuidade)`,
        MainMenu.GetMenuOptions(customer),
      ...sufixMessages
      ],
      StepNumbers.mainMenu
    )
  }

} 